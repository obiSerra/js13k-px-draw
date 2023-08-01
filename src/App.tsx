import React, { useEffect } from "react";
import "./App.css";
import Image from "./features/image/Image";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { clear, load, save, selectImage } from "./features/image/imageSlice";
import { SketchPicker } from "react-color";

function App() {
  const [size, setSize] = React.useState(20);
  const [color, setColor] = React.useState("#fff");
  const [image, setImage] = React.useState("");
  const [deleteMode, setDeleteMode] = React.useState(false);
  const dispatch = useAppDispatch();
  const imageContent = useAppSelector(selectImage);

  const onChangeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(e.target.value));
  };

  const saveImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch(save());
  };

  const clearImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch(clear());
  };

  const toggleDeleteMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked ? setDeleteMode(true) : setDeleteMode(false);
  };

  const ref = React.useRef(null);

  const reloadImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const node = ref.current as any;
    const parsed = JSON.parse(node.value.replaceAll('"n"', "null"));
    dispatch(load(parsed));
  };

  const onChange = (e: any) => {
    const node = ref.current as any;
    const parsed = JSON.parse(node.value.replaceAll('"n"', "null"));
    setImage(compileImage(parsed));
  };

  const compileImage = (img: any) => JSON.stringify(img).replaceAll("null", '"n"').replaceAll("],[", "],\n[");

  useEffect(() => {
    setImage(compileImage(imageContent));
  }, [imageContent]);

  return (
    <div className="App">
      <label htmlFor="zoom">Zoom</label>
      <input type="number" name="zoom" onChange={onChangeSize} value={size} size={2} />
      <br />
      <button type="button" onClick={saveImage}>
        Save
      </button>{" "}
      <button type="button" onClick={clearImage}>
        Clear
      </button>
      <br />
      <SketchPicker color={color} onChangeComplete={c => setColor(c.hex)} />
      <label htmlFor="delete">Delete</label>
      <input type="checkbox" name="delete" id="delete" onChange={toggleDeleteMode} />
      <Image pxSize={size} color={deleteMode ? null : color} />
      <textarea name="" id="" cols={100} rows={40} ref={ref} value={image} onChange={onChange}/>
      <button onClick={reloadImage}>Reload</button>
    </div>
  );
}

export default App;
