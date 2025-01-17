import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		console.log(file);
		cb(null, 'public/images/products');
	},
	filename: (req, file, callback) => {
		const fname = `prod_image_d_${Date.now()}_random_${Math.random() * 10E9}_orgname_${file.originalname}`;
		callback(null, fname);
	}
});

export const fileUploader = multer({ storage });