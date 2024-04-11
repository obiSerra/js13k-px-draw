import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Button, ButtonGroup, Checkbox, FormControlLabel, Slider, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { SketchPicker } from "react-color";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Image from "./features/image/Image";
import { clear, load, save, selectImage } from "./features/image/imageSlice";

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
  // const canvasSize = useAppSelector(state => state.image.canvasSize);

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
    let value = node.value;
    try {
      const parsed = JSON.parse(value);
      dispatch(load(parsed));
    } catch (e) {
      console.error("Invalid JSON");
      console.log(e);
    }
  };

  const onChange = (e: any) => {
    const node = ref.current as any;
    let value = node.value;

    try {
      value = JSON.parse(value);
    } catch (e) {
      console.error("Invalid JSON");
      console.log(e);
    }
    setImage(compileImage(value));
  };

  const compileImage = (img: any) => JSON.stringify(img).replaceAll("],[", "],\n[");

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

  // const presetColors = ["#000000", "#0f7efb", "#4a90e2", "#79b2f2"];

  return (
    <div className="App">
      <div className="zoom-commands">
        <Zoom onChangeSize={onChangeSize} size={size} />
      </div>
      <div className="status-commands">
        <StatusBtnBar onSave={saveImage} onClear={clearImage} />
        {/* <div>
          <br />
          <br />
          <label htmlFor="canvasSizeH">H</label>
          <TextField name="canvasSIzeH" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} size="small"/>
          <br />
          <label htmlFor="canvasSizeL">L</label>
          <TextField name="canvasSIzeL" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} size="small"/>


        </div> */}
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
