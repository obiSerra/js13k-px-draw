import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { colorPixel, selectImage } from "./imageSlice";

type ImageProps = {
  pxSize: number;
  color: string | null;
};
type RowProps = { els: (string | null)[]; pxSize: number; rIndex: number; mouseDown: boolean; color: string | null };

const Row = ({ els, rIndex, pxSize, mouseDown, color }: RowProps) => {
  const dispatch = useAppDispatch();

  const onClick = (e: any, x: number, y: number) => {
    const color = "#000";

    if (color !== null) {
      dispatch(colorPixel({ color, x, y }));
    }
  };
  const onHover = (e: any, x: number, y: number) => {
    if (mouseDown) {
      dispatch(colorPixel({ color, x, y }));
    }
  };

  return (
    <tr>
      {els.map((c: string | null, i) => {
        let defColor = "#fff";
        if ((rIndex + i) % 2 === 0) defColor = "#ccc";

        let style = { backgroundColor: defColor, width: pxSize, height: pxSize, border: "1px solid red" };

        if (c !== null) {
          style = { ...style, backgroundColor: c };
        }

        return <td key={i} style={style} onMouseMove={e => onHover(e, rIndex, i)}></td>;
      })}
    </tr>
  );
};

export default function Image({ pxSize, color }: ImageProps) {
  const image = useAppSelector(selectImage);
  const [mouseDown, setMouseDown] = useState(false);

  const onMouseDown = () => {
    setMouseDown(true);
  };
  const onMouseUp = () => {
    setMouseDown(false);
  };

  return (
    <table style={{ borderCollapse: "collapse" }} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <tbody>
        {image.map((r, i) => (
          <Row els={r} key={i} pxSize={pxSize} rIndex={i} mouseDown={mouseDown} color={color} />
        ))}
      </tbody>
    </table>
  );
}
