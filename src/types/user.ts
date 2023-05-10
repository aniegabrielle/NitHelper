import { User } from "firebase/auth";
import { Report } from "./post";

export interface UserSystem extends User {
	role?: "citizen" | "publicAgent";
}

export interface Citizen extends UserSystem {
	zipCode: string;
	address: string;
	posts?: Report[];
	comments?: Comment[];
}

export interface PublicAgent extends UserSystem {
	office: string;
	register: string;
	active: boolean;
}
