import { G, Path, Svg } from 'react-native-svg';

import { iconWithClassName } from './iconWithClassName';

const Binance = (props: any) => (
  <Svg viewBox="0 0 126.61 126.61" xmlns="http://www.w3.org/2000/svg" {...props}>
    <G fill="#f3ba2f">
      <Path d="m38.73 53.2 24.59-24.58 24.6 24.6 14.3-14.31L63.32 0l-38.9 38.9zM0 63.31 14.3 49l14.31 14.31-14.31 14.3zM38.73 73.41 63.32 98l24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88zM98 63.31 112.3 49l14.31 14.3-14.31 14.32z" />
      <Path d="M77.83 63.3 63.32 48.78 52.59 59.51l-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.47z" />
    </G>
  </Svg>
);

iconWithClassName(Binance);

export { Binance };
