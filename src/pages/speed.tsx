import ReactSpeedometer, {CustomSegmentLabelPosition} from "react-d3-speedometer";

type CustomSegmentLabel = {
  text?: string
  position?: CustomSegmentLabelPosition
  fontSize?: string
  color?: string
}

const Speed = () => {
  return (
    <div className=" flex items-center justify-center w-full h-screen">
      <ReactSpeedometer
        segments={3}
        segmentColors={["#F9462D", "#F7BE2D", "#3FE972", "#a3be8c", "#b48ead"]}
        needleColor="#000000"
        ringWidth={110}
      />
    </div>
  );
};

export default Speed;
