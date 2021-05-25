import React, { Fragment } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Tag } from 'antd';
import classNames from 'classnames';
import StandRecordsHoc from '../RecordsHoc';
import {
  IListCtrlHocInjectProps,
  IListCtrlHocParams,
  IRecordsHocFullParams,
  TListCtrlHocComponent,
  IListCtrlHocProps,
  IModalTriggerOpts,
  ICommonObj,
  TIdSelectCtrlHocComponent,
} from '../../interface';
import IdSelectCtrlHoc from './IdSelectCtrlHoc';
import { StandContext } from '../../const';

import styles from '../styles';

interface IListCtrlState {
  modalVisible: boolean | undefined;
}

function defaultModalTriggerButtonRender<R>(opts: IModalTriggerOpts<R>) {
  const { props, showModal, context } = opts;

  const { recordNsTitle, checkedList } = context;

  const { modalTriggerDisabled, modalTriggerTitle } = props;

  return (
    <Button
      icon={<PlusCircleOutlined />}
      disabled={modalTriggerDisabled}
      onClick={showModal}
    >
      {modalTriggerTitle || `选择${recordNsTitle}`} (已选 {checkedList.length})
    </Button>
  );
}

function defaultModalTriggerCheckedListRender<R>(opts: IModalTriggerOpts<R>) {
  const { context } = opts;

  const { toggleChecked, checkedList, getRecordId, getRecordName } = context;

  return (
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
  );
}

function defaultModalTriggerRender<R>(opts: IModalTriggerOpts<R>) {
  const { props } = opts;

  const { modalTriggerClassName } = props;

  const {
    modalTriggerButtonRender = defaultModalTriggerButtonRender,
    modalTriggerCheckedListRender = defaultModalTriggerCheckedListRender,
  } = props;

  return (
    <div className={modalTriggerClassName}>
      {modalTriggerButtonRender(opts)}
      {modalTriggerCheckedListRender(opts)}
    </div>
  );
}

export default function<
  R extends ICommonObj = any,
  P extends IListCtrlHocInjectProps<R> = any
>(hocParams: IListCtrlHocParams<R>) {
  const { ...restHocParams } = hocParams;

  const defaultHocParams: IListCtrlHocParams<R> = {
    isModalMode: true,
    isStandListCtrl: true,
    listRowSelectionSupport: true,
    defaultModalVisible: false,
    searchRecordsOnMount: false,
    clearCheckedAfterClose: false,
    resetSearchParamsOnModalShow: false,
    resetCheckedOnModalShow: false,
    passSearchUpdateIfStoreStale: true,
    syncParamsToUrl: false,
  };

  if (!('syncParamsToUrl' in restHocParams)) {
    defaultHocParams.syncParamsToUrl = !restHocParams.isModalMode;
  }

  type OuterCompProps = Omit<P, keyof IListCtrlHocInjectProps<R>>;

  return (
    WrappedComponent: React.ComponentType<P>,
  ): TListCtrlHocComponent<R, OuterCompProps> => {
    type InnerCompProps = OuterCompProps &
      Omit<IListCtrlHocProps<R>, keyof IRecordsHocFullParams<R>> & {
        searchRecordsOnMount?: boolean;
        listRowSelectionSupport?: boolean;
      };

    class Comp extends React.Component<InnerCompProps, IListCtrlState> {
      static defaultProps = {
        ...defaultHocParams,
        ...restHocParams,
      };

      static contextType = StandContext;
      context!: React.ContextType<typeof StandContext>;

      static getDerivedStateFromProps(
        props: InnerCompProps,
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

      constructor(props: InnerCompProps) {
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

      componentDidUpdate(prevProps: InnerCompProps, prevState: IListCtrlState) {
        const prevModalVisible = this.isModalVisible(prevProps, prevState);
        const currModalVisible = this.isModalVisible();

        if (!prevModalVisible && currModalVisible) {
          const { resetSearchParamsOnModalShow } = this.props;
          this.context.debouncedSearchRecords(
            resetSearchParamsOnModalShow ? {} : undefined,
          );
        }
      }

      isModalVisible = (
        specProps?: InnerCompProps,
        specState?: IListCtrlState,
      ) => {
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

      toggleModalVisible = (v: boolean) => {
        return this.toggleVisible(v);
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

    const standHocParams: IListCtrlHocParams<R> = {
      ...defaultHocParams,
      ...restHocParams,
      takeOverMount: true,
    };

    const FinalComp = StandRecordsHoc<R, P>({
      makeRecordModelPkgDynamic: standHocParams.isModalMode
        ? 'ListCtrl'
        : undefined,
      ...standHocParams,
    })(Comp as any) as TListCtrlHocComponent<R, OuterCompProps>;

    const IdSelectHocParams: IListCtrlHocParams<R> = {
      makeRecordModelPkgDynamic: 'IdSelectCtrl',
      ...standHocParams,
    };

    FinalComp.IdSelectCtrl = (StandRecordsHoc<R, P>({
      ...IdSelectHocParams,
      makeRecordModelPkgDynamic: 'IdSelectCtrlOuterWrapper',
      searchRecordsOnParamsChange: false,
      receiveHocParamsAsProps: false,
      receiveContextAsProps: false,
    })(
      // First StandRecordsHoc hoc, just provide the context IdSelectCtrlHoc needs
      IdSelectCtrlHoc<R, IListCtrlHocInjectProps<R>>()(
        // Second level, the real core ListHocComp
        StandRecordsHoc<R, P>(IdSelectHocParams)(Comp as any) as any,
      ),
    ) as any) as TIdSelectCtrlHocComponent<R, OuterCompProps>;

    return FinalComp;
  };
}
