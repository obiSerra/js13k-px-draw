import React, { useEffect } from "react";
import "./App.css";
import Image from "./features/image/Image";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { clear, load, save, selectImage } from "./features/image/imageSlice";
import { SketchPicker } from "react-color";
import { Button, ButtonGroup, Checkbox, FormControlLabel, Slider, Stack } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

type ZoomPros = {
  onChangeSize: (event: Event, value: number | number[], activeThumb: number) => void;
  size: number;
};

const Zoom = ({ onChangeSize, size }: ZoomPros) => {
  return (
    <>
      <label htmlFor="zoom">Zoom</label>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <ZoomOutIcon />
        <Slider aria-label="Volume" value={size} onChange={onChangeSize} />
        <ZoomInIcon />
      </Stack>
    </>
  );
};

type StatusBtnBarProps = {
  onSave: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClear: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const StatusBtnBar = ({ onSave, onClear }: StatusBtnBarProps) => {
  return (
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <Button onClick={onSave} variant="contained">
        Save
      </Button>{" "}
      <Button onClick={onClear} variant="outlined">
        Clear
      </Button>
    </ButtonGroup>
  );
};

function App() {
  const [size, setSize] = React.useState(20);
  const [color, setColor] = React.useState("#fff");
  const [image, setImage] = React.useState("");
  const [deleteMode, setDeleteMode] = React.useState(false);
  const dispatch = useAppDispatch();
  const imageContent = useAppSelector(selectImage);

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

  const onChangeSize = (event: Event, value: number | number[], activeThumb: number) => {
    setSize(value as number);
  };

  const label = { inputProps: { "aria-label": "Erase" } };

  const presetColors = [
    "#D0021B",
    "#F5A623",
    "#F8E71C",
    "#8B572A",
    "#7ED321",
    "#417505",
    "#BD10E0",
    "#9013FE",
    "#4A90E2",
    "#50E3C2",
    "#B8E986",
    "#000000",
    "#4A4A4A",
    "#9B9B9B",
    "#FFFFFF",
  ];

  return (
    <div className="App">
      <div className="zoom-commands">
        <Zoom onChangeSize={onChangeSize} size={size} />
      </div>
      <div className="status-commands">
        <StatusBtnBar onSave={saveImage} onClear={clearImage} />
      </div>
      <div className="draw-commands">
        <FormControlLabel control={<Checkbox {...label} onChange={toggleDeleteMode} />} label="Erase" />
        <SketchPicker color={color} onChangeComplete={c => setColor(c.hex)} presetColors={presetColors} />
      </div>
      <div className="main-image">
        <Image pxSize={size} color={deleteMode ? null : color} />
      </div>

      <div className="image-data">
        <textarea name="" id="" cols={100} rows={40} ref={ref} value={image} onChange={onChange} />
        <button onClick={reloadImage}>Reload</button>
      </div>
    </div>
  );
}

export default App;
