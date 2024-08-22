import express from "express";
import cors from "cors";
import { getAllDataBooks, getBookById } from "./services/services";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
	origin: "*"
}));

app.get("/books", async (req, res) => {
	const page = req.query.page ? parseInt(req.query.page as string) : 1;
	const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
	const filter = req.query.filter ? req.query.filter as string : "date";
	const search = req.query.search ? req.query.search as string : "all";
	const books = await getAllDataBooks({ page, limit, filter, search });
	res.send(books);
});

app.get("/book/:id", async (req, res) => {
	const id = req.params.id;
	const books = await getBookById({ id: Number(id) });
	res.send(books);
});

app.post("/clerk/webhook", async (req, res) => {
	const body = req.body;
	console.log(body);
	res.send(body);
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});