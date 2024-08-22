import prisma from "../utils/prisma";

interface GetBookProps {
	page: number,
	limit: number,
	filter: string,
	search: string,
}

export async function getAllDataBooks({ page = 1, limit = 12, filter, search }: GetBookProps) {
	let BookDetail = {};
	switch (filter) {
		case "date":
			BookDetail = {
				createdAt: "desc"
			};
			break;
		case "name":
			BookDetail = {
				title: "asc"
			};
			break;
		case "stock":
			BookDetail = {
				stock: "desc"
			};
			break;
		case "update":
			BookDetail = {
				updatedAt: "desc"
			};
			break;
		default:
			BookDetail = {
				createdAt: "desc"
			};
	}

	const books = await prisma.book.findMany({
		where: {
			BookDetail: {
				title: {
					contains: search === "all" ? "" : search,
					mode: "insensitive"
				}
			}
		},
		include: {
			BookDetail: {
				include: {
					PriceHistory: {
						orderBy: {
							createdAt: "desc"
						},
					}
				}
			}
		},
		skip: (page - 1) * limit,
		take: limit,
		orderBy: {
			BookDetail
		},
	});

	const count = await prisma.book.count({
		where: {
			BookDetail: {
				title: {
					contains: search === "all" ? "" : search,
					mode: "insensitive"
				}
			}
		}
	});
	const totalPages = Math.ceil(count / limit);
	const nextPage = page < totalPages ? page + 1 : null;
	const prevPage = page > 1 ? page - 1 : null;

	return {
		list: books,
		nextPage,
		prevPage,
		totalPages
	};
}


export async function getBookById({ id }: { id: number }) {
	const book = await prisma.book.findUnique({
		where: {
			id
		},
		include: {
			BookDetail: {
				include: {
					PriceHistory: {
						orderBy: {
							createdAt: "desc"
						},
					}
				}
			}
		}
	});

	return book;
}