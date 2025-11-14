import Svg, { Path } from "react-native-svg";

export default function IndexShape() {
  return (
    <Svg
      width="100%"
      height="200"
      viewBox="0 0 375 200"
      fill="none"
    >
      <Path
        d="M0,100 C100,200 275,0 375,100 L375,0 L0,0 Z"
        fill="#6C2BD9" // roxo
      />
    </Svg>
  );
}
