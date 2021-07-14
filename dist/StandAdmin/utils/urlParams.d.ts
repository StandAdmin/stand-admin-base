export declare const TypeParamsPrefixList: (
  | {
      prefix: string;
      test: (val: any) => boolean;
      fromUrl: typeof parseFloat;
      toUrl?: undefined;
    }
  | {
      prefix: string;
      test: (val: any) => boolean;
      toUrl: (v: boolean) => 1 | 0;
      fromUrl: (v: string) => boolean;
    }
  | {
      prefix: string;
      test: (val: any) => boolean;
      toUrl: (obj: any) => string;
      fromUrl: (v: string) => any;
    }
)[];
export declare const paramToUrl: (
  key: string,
  val: any,
) => {
  [x: string]: any;
};
export declare const paramFromUrl: (
  key: string,
  val: any,
) => {
  [x: string]: any;
};
