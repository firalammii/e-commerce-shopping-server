import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configuration
cloudinary.config({
	cloud_name: 'djwoyr4yc',
	api_key: '829864477346782',
	api_secret: 'P7vHk4ocORhEoyD_FhR0dfGn6AU',
	// API_env: 'CLOUDINARY_URL=cloudinary://829864477346782:P7vHk4ocORhEoyD_FhR0dfGn6AU@djwoyr4yc'
});

const storage = new multer.memoryStorage();

async function cloudinaryUpload (fileUrl) {

	// Upload an image
	const uploadResult = await cloudinary.uploader
		.upload(fileUrl, { resource_type: 'auto', })
		.catch((error) => {
			console.log(error);
		});

	// console.log(uploadResult);
	return uploadResult;


	// Optimize delivery by resizing and applying auto-format and auto-quality
	const optimizeUrl = cloudinary.url('shoes', {
		fetch_format: 'auto',
		quality: 'auto'
	});

	console.log(optimizeUrl);

	// Transform the image: auto-crop to square aspect_ratio
	const autoCropUrl = cloudinary.url('shoes', {
		crop: 'auto',
		gravity: 'auto',
		width: 500,
		height: 500,
	});

	console.log(autoCropUrl);
};

const multerUpload = multer({ storage });

export { multerUpload, cloudinaryUpload };
