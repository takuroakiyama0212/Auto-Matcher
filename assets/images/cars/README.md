Car Image Folder

Please add car images to this folder.

How to Add Images

Copy image files into this folder (assets/images/cars/)

Use clear and descriptive file names (e.g. porsche-911.jpg, tesla-model-s.jpg)

Supported formats: .jpg, .jpeg, .png, .webp

Usage Example

After adding images, you can reference them in client/data/cars.ts as shown below:

// For using local images (Web)
imageUrl: "/assets/images/cars/porsche-911.jpg"

// Or using require() (Mobile)
// Note: dynamic paths are not supported, so each image must be imported individually

Notes

When used in a web browser, images should be placed in assets/images/cars/ and referenced via relative paths

When used in a mobile app, each image must be imported using require()