import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const StartEndNode = ({
    data
}) => {

    return (
      <>
        <Handle type={data.isStart?"spurce":"target"} position={data.isStart?Position.Bottom:Position.Top} />
        <div style={{ padding: 10 }}>{data.isStart?"Input":"Output"}</div>
      </>
    );
  };

export default memo(StartEndNode);