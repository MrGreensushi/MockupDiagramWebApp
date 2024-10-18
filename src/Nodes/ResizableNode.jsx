import { memo, useState } from 'react';
import { Handle, Position, NodeResizer, NodeToolbar } from '@xyflow/react';
import { Button, ButtonGroup, Row } from 'react-bootstrap';

const ResizableNode = ({
  data,
  selected}) => {

    return (
      <>
        <NodeResizer
          color="#ff0071"
          isVisible={selected}
          minWidth={100}
          minHeight={30}
        />
        <Handle type="target" position={Position.Top} />
        <div style={{ padding: 10 }}>{data.label}</div>
        <Handle type="source" position={Position.Bottom} />
        <NodeToolbar>
          <ButtonGroup>
            <Button variant="secondary" onClick={() => data.onClickCopy(data.id)}>
              <i className="bi bi-copy" aria-label='copy'/>
            </Button>
            <Button variant="secondary" onClick={data.onClickEdit}>
              <i className="bi bi-pencil" aria-label='edit'/>
            </Button>
            <Button variant="secondary" onClick={() => data.onClickDelete(data.id)}>
              <i className="bi bi-trash3" aria-label='delete'/>
            </Button>
          </ButtonGroup>
        </NodeToolbar>
      </>
    );
  };

export default memo(ResizableNode);