import json
from PIL import Image


def rgb_to_hex(r, g, b):
    return "#{:02x}{:02x}{:02x}".format(r, g, b)


def convert_image(img_name):
    # Open the image form working directory
    image = Image.open(f"images/{img_name}.png")
    # summarize some details about the image
    print(image.format)
    print(image.size)
    print(image.mode)
    image = image.transpose(Image.FLIP_LEFT_RIGHT)
    image = image.transpose(Image.ROTATE_90)

    pixels = image.load()  # this is not a list, nor is it list()'able
    width, height = image.size

    all_pixels = []
    for x in range(height):
        row = []
        for y in range(width):
            cpixel = pixels[x, y]
            if cpixel[-1] == 0:
                val = None
            else:
                val = rgb_to_hex(cpixel[0], cpixel[1], cpixel[2])
            row.append(val)
        all_pixels.append(row)

    return all_pixels


if __name__ == "__main__":
    images = [
        "idle_1",
        "idle_2",
        "run_1",
        "fire",
        "roll_1",
        "bolt_1",
        "bolt_2",
        "en_idle_1",
        "en_idle_2",
        "bolt_exp_1",
        "bolt_exp_2",
        "bolt_exp_3",
        "life",
        "dem_1",
        "dem_2",
        "dem_3",
    ]
    # images = []
    # images = []

    out = {}
    for img in images:
        out[img] = convert_image(img)

    with open(f"input-images.json", "w") as outfile:
        json.dump(out, outfile)
