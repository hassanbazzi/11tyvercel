import fs from "fs";
import path from "path";

module.exports = async function (req, res) {
	try {
		console.log("full req", req);
		if (!req.cookies.authorization) {
			res.statusCode = 302;
			res.setHeader("location", "/login");
			return res.end();
		}

		const filePath = path.join(
			process.cwd(),
			`${req.url.slice(0, req.url.indexOf("urlmatch") - 1)}/index.html`
		);
		console.log("filepath", filePath);
		const imageBuffer = fs.createReadStream(filePath);

		await new Promise(function (resolve) {
			res.setHeader("Content-Type", "text/html; charset=UTF-8");
			imageBuffer.pipe(res);
			imageBuffer.on("end", resolve);
			imageBuffer.on("error", function (err) {
				if (err.code === "ENOENT") {
					res.status(404).json({
						error: true,
						message: "Sorry we could not find the file you requested!",
					});
					res.end();
				} else {
					res
						.status(500)
						.json({ error: true, message: "Sorry, something went wrong!" });
					res.end();
				}
			});
		});
	} catch (err) {
		res.status(400).json({ error: true, message: err });
		res.end();
	}
};
