// Add your code here
// Add your code here
namespace imagemorph {
  function transferPixel(destinationImage: Image, originImage: Image, pixel_array: number[]) {
      let random_pixel = pixel_array.removeAt(
        randint(0, pixel_array.length - 1)
      );
      let y = Math.floor(random_pixel / originImage.width);
      let x = random_pixel % originImage.width;
      destinationImage.setPixel(x, y, originImage.getPixel(x, y));
    }

  
    //% group="Sprites"
    //% blockId="spritemorphimage"
    //% blockId=spritemorphimage block="morph %sprite(mySprite) image to %img=screen_image_picker"
    //% weight=7 help=sprites/sprite/set-image
    //% sprite.shadow="variables_get"
    //% sprite.defl="mySprite"
    export function morph(mySprite: Sprite, new_image: Image) {
        let destination_sprite = mySprite;
        let largest_width = Math.max(new_image.width, destination_sprite.image.width);
        let largest_height = Math.max(new_image.height, destination_sprite.image.height);

        let canvas = image.create(largest_width, largest_height);
        let original_x_offset = Math.floor( (largest_width / 2) - (destination_sprite.image.width / 2) );
        let original_y_offset = Math.floor( (largest_width / 2) - (destination_sprite.image.width / 2) );

        let new_canvas = image.create(largest_width, largest_height);
        let new_x_offset = Math.floor( (largest_width / 2) - (new_image.width / 2) );
        let new_y_offset = Math.floor( (largest_width / 2) - (new_image.width / 2) );

        let original_image = destination_sprite.image;
        destination_sprite.x -= original_x_offset;
        destination_sprite.y -= original_y_offset;
        destination_sprite.setImage(canvas);

        // Copy original image to large original_canvas
        let num_pixels = original_image.width * original_image.height;
        for (let index = 0; index < num_pixels; index++) {
            let y = Math.floor(index / original_image.width);
            let x = index % original_image.width;
            canvas.setPixel((x + original_x_offset), (y + original_y_offset), original_image.getPixel(x, y));
        }
        
        // Copy new image to large new_canvas
        num_pixels = new_image.width * new_image.height;
        for (let index = 0; index < num_pixels; index++) {
            let y = Math.floor(index / new_image.width);
            let x = index % new_image.width;
            new_canvas.setPixel((x + new_x_offset), (y + new_y_offset), new_image.getPixel(x, y));
        }

        // Morph
        let pixels_to_change = [];
        num_pixels = canvas.width * canvas.height;
        for (let index = 0; index < num_pixels; index++) {
            pixels_to_change.push(index);
        }
        
        while (pixels_to_change.length > 0) {
            let group_size = Math.floor(pixels_to_change.length/100) + 1
            for (let index = 0; index < group_size; index++) {
                transferPixel(canvas, new_canvas, pixels_to_change);
            }
            pause(0.01);
        }

        destination_sprite.setImage(new_image);
        destination_sprite.x += new_x_offset;
        destination_sprite.y += new_y_offset;

    }

// Destination image should have width of max(image_a.width, image_b.width)
// and height of max(image_a.height, image_b.height).
// After copy and morph, just set the sprite to the final image to trim
// any transparent pixels.

    //% group="Screen"
    //% blockId="backgroundmorphimage"
    //% blockId=backgroundmorphimage block="morph backgound image to %img=background_image_picker"
    //% weight=7
    export function morphBackground(myImage: Image) {
        const scene = game.currentScene();
        let pixels_to_change = [];
        let num_pixels = myImage.width * myImage.height;
        for (let index = 0; index < num_pixels; index++) {
            pixels_to_change.push(index);
        }

        while (pixels_to_change.length > 0) {
            let group_size = Math.floor(pixels_to_change.length/100) + 1
            for (let index = 0; index < group_size; index++) {
            transferPixel(scene.background.image, myImage, pixels_to_change);
            }
            pause(0.01);
        }
    }
}