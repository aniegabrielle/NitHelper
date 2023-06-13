import { User } from "firebase/auth";

type Status = "atendido" | "não atendido";

interface Post {
	id: string;
	description: string;
	createdAt: Date;
	user: {
		id: User["uid"];
		name: User["displayName"];
	};
}

export interface Report extends Post {
	type: string;
	address: string;
	status: Status;
	comments: Comment[];
}

export interface Comment extends Post {
	reportId: Report["id"];
}
