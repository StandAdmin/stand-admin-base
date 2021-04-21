import React, { Fragment } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Tag } from 'antd';
import classNames from 'classnames';
import StandRecordsHoc from '../RecordsHoc';
import {
  IListCtrlHocInjectProps,
  IListCtrlHocParams,
  TListCtrlHocComponent,
  IListCtrlHocProps,
  ModalTriggerOpts,
  ICommonObj,
  TIdSelectCtrlHocComponent,
} from '../../interface';
import IdSelectCtrlHoc from './IdSelectCtrlHoc';
import { StandContext } from '../../const';

import styles from '../styles';

interface IListCtrlState {
  modalVisible: boolean | undefined;
}

function defaultModalTriggerRender<R>({
  props,
  showModal,
  context,
}: ModalTriggerOpts<R>) {
  const {
    recordNsTitle,
    toggleChecked,
    checkedList,
    getRecordId,
    getRecordName,
  } = context;

  const {
    modalTriggerDisabled,
    modalTriggerTitle,
    modalTriggerClassName,
  } = props;

  return (
    <div className={modalTriggerClassName}>
      <Button
        onClick={showModal}
        icon={<PlusCircleOutlined />}
        disabled={modalTriggerDisabled}
      >
        选择{modalTriggerTitle || recordNsTitle} (已选 {checkedList.length})
      </Button>
      <div className={styles.tagList}>
        {checkedList.map(record => (
          <Tag
            key={getRecordId(record)}
            closable
            onClose={() => {
              toggleChecked(record, false);
            }}
          >
            {getRecordId(record)}
            {record ? `: ${getRecordName(record)}` : ''}
          </Tag>
        ))}
      </div>
    </div>
  );
}

export default function<
  R extends ICommonObj = any,
  P extends IListCtrlHocInjectProps<R> = any
>(hocParams: IListCtrlHocParams<R>) {
  const { ...restHocParams } = hocParams;

  const defaultRestHocParams: IListCtrlHocParams<R> = {
    isModalMode: true,
    isStandListCtrl: true,
    listRowSelectionSupport: true,
    defaultModalVisible: false,
    searchRecordsOnMount: false,
    clearCheckedAfterClose: false,
    resetSearchParamsOnModalShow: false,
    resetCheckedOnModalShow: false,
    ...restHocParams,
  };

  if (!('syncParamsToUrl' in defaultRestHocParams)) {
    defaultRestHocParams.syncParamsToUrl = !defaultRestHocParams.isModalMode;
  }

  return (
    WrappedComponent: React.ComponentType<P>,
  ): TListCtrlHocComponent<R, P> => {
    type OuterProps = Omit<P, keyof IListCtrlHocInjectProps<R>> &
      IListCtrlHocProps<R>;

    class Comp extends React.Component<OuterProps, IListCtrlState> {
      static defaultProps = {
        ...defaultRestHocParams,
      };

      static contextType = StandContext;
      context!: React.ContextType<typeof StandContext>;

      static getDerivedStateFromProps(
        props: OuterProps,
        state: IListCtrlState,
      ) {
        if ('modalVisible' in props) {
          return {
            ...state,
            modalVisible: props.modalVisible,
          };
        }
        return null;
      }

      constructor(props: OuterProps) {
        super(props);
        this.state = {
          modalVisible:
            'modalVisible' in props
              ? props.modalVisible
              : props.defaultModalVisible,
        };
      }

      componentDidMount() {
        const { searchRecordsOnMount, isModalMode } = this.props;

        if (!isModalMode || this.isModalVisible() || searchRecordsOnMount) {
          this.context.debouncedSearchRecords();
        }
      }

      componentDidUpdate(prevProps: OuterProps, prevState: IListCtrlState) {
        const prevModalVisible = this.isModalVisible(prevProps, prevState);
        const currModalVisible = this.isModalVisible();

        if (!prevModalVisible && currModalVisible) {
          const { resetSearchParamsOnModalShow } = this.props;
          this.context.debouncedSearchRecords(
            resetSearchParamsOnModalShow ? {} : undefined,
          );
        }
      }

      isModalVisible = (specProps?: OuterProps, specState?: IListCtrlState) => {
        const { modalProps = {} } = specProps || this.props;

        if (modalProps.visible !== undefined) {
          return modalProps.visible;
        }

        const { modalVisible } = specState || this.state;

        return modalVisible;
      };

      showModal = () => {
        this.toggleVisible(true);
      };

      hideModal = () => {
        this.toggleVisible(false);
      };

      toggleVisible = (v: boolean) => {
        this.setState({ modalVisible: v });

        const {
          onModalShow,
          onModalHide,
          onModalVisibleChange,
          resetCheckedOnModalShow,
          defaultCheckedList,
        } = this.props;

        const { setChecked } = this.context;

        if (v) {
          if (resetCheckedOnModalShow) {
            setChecked(defaultCheckedList || []);
          }
          if (onModalShow) {
            onModalShow();
          }
        } else if (onModalHide) {
          onModalHide();
        }

        if (onModalVisibleChange) {
          onModalVisibleChange(v);
        }
      };

      handleOK = () => {
        const { checkedList } = this.context;

        this.hideModal();

        const { onModalOk } = this.props;
        if (onModalOk) {
          onModalOk({ checkedList });
        }
      };

      clearChecked = () => {
        this.context.clearChecked();
      };

      renderFooter = () => {
        const { listRowSelectionSupport, maxCheckedLength } = this.props;

        const { storeRef, checkedList, checkAll, isAllChecked } = this.context;

        const { records = [] } = storeRef || {};

        return (
          <div className={styles.footer}>
            {listRowSelectionSupport && (
              <>
                <div className={styles.block}>
                  {maxCheckedLength > 0 ? `限选 ${maxCheckedLength}，` : ''}已选{' '}
                  {checkedList.length}
                </div>
                <div className={styles.block}>
                  <Button
                    type="link"
                    disabled={isAllChecked(records)}
                    onClick={() => checkAll(records)}
                    // className={styles.opBtn}
                  >
                    全选
                  </Button>

                  <Button
                    type="link"
                    disabled={checkedList.length === 0}
                    onClick={this.clearChecked}
                    // className={styles.opBtn}
                  >
                    清空
                  </Button>
                </div>
              </>
            )}
            <div className={classNames(styles.block, styles.right)}>
              {/* <Button style={{ marginRight: 12, width: 80 }} onClick={this.hideModal}>
                取消
              </Button> */}
              <Button
                style={{ width: 80 }}
                type="primary"
                onClick={this.handleOK}
              >
                确定
              </Button>
            </div>
          </div>
        );
      };

      renderModalTrigger = () => {
        const { modalTrigger = defaultModalTriggerRender } = this.props;

        if (typeof modalTrigger === 'function') {
          return modalTrigger(this);
        }

        return modalTrigger;
      };

      onCheckChange = (checked: boolean, record: R) => {
        this.context.toggleChecked(record, checked);
      };

      onModalAfterClose = () => {
        const { modalProps = {}, clearCheckedAfterClose } = this.props;

        const { afterClose: origAfterClose } = modalProps || ({} as any);

        if (clearCheckedAfterClose) {
          this.clearChecked();
        }

        if (origAfterClose) {
          origAfterClose();
        }
      };

      renderModal = (mainContent: React.ReactElement) => {
        const { recordNsTitle } = this.context;

        const { modalProps, modalWrapperClassName } = this.props;

        const modalVisible = this.isModalVisible();

        return (
          <Modal
            wrapClassName={classNames(
              styles.modalWrapper,
              modalWrapperClassName,
            )}
            title={`选择${recordNsTitle}`}
            // onOk={this.handleOk}
            onCancel={this.hideModal}
            // afterClose={this.onAfterClose}
            width="80%"
            footer={this.renderFooter()}
            destroyOnClose
            {...modalProps}
            afterClose={this.onModalAfterClose}
            visible={modalVisible}
          >
            {React.cloneElement(mainContent, {
              toggleModalVisible: this.toggleVisible,
            })}
          </Modal>
        );
      };

      render() {
        const {
          modalProps,
          modalTrigger,
          modalTriggerTitle,
          modalWrapperClassName,
          modalTriggerClassName,
          isModalMode,
          ...restProps
        } = this.props;

        const mainContent = (
          <WrappedComponent
            {...(restProps as any)}
            {...{
              isModalMode,
            }}
          />
        );

        return isModalMode ? (
          <Fragment>
            {this.renderModalTrigger()}
            {this.renderModal(mainContent)}
          </Fragment>
        ) : (
          mainContent
        );
      }
    }

    const standHocParams = {
      ...defaultRestHocParams,
      takeOverMount: true,
    };

    const FinalComp = (StandRecordsHoc<R, P>({
      makeRecordModelPkgDynamic: 'ListCtrl',
      ...standHocParams,
    })(Comp as any) as unknown) as TListCtrlHocComponent<R, P>;

    const IdSelectHocParams = {
      makeRecordModelPkgDynamic: 'IdSelectCtrl',
      ...standHocParams,
    };

    FinalComp.IdSelectCtrl = (StandRecordsHoc<R, P>({
      ...IdSelectHocParams,
      searchRecordsOnParamsChange: false,
    })(
      // First StandRecordsHoc hoc, just provide the context IdSelectCtrlHoc needs
      IdSelectCtrlHoc<R, IListCtrlHocInjectProps<R>>()(
        // Second level, the real core ListHocComp
        StandRecordsHoc<R, P>(IdSelectHocParams)(Comp as any),
      ),
    ) as any) as TIdSelectCtrlHocComponent<R, P>;

    return FinalComp;
  };
}
