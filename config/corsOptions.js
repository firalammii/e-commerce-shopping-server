const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:5174",
	"https://firashoppingapp.onrender.com",
	"https://firashopping.netlify.app"
]

const corsOptions = {
	origin: (origin, callback) => {
		if (allowedOrigins.includes(origin) || !origin)
			callback(null, true);
		else callback(new Error("Not allowed by cors"));
	},
	credentials: true,
	optionsSuccessStatus: 200
};

export {allowedOrigins, corsOptions}