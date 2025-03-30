class APIError extends Error {
	constructor(status, message, isOperational = true) {
		super(message);
		this.message = message;
		this.status = status;
	}
}

export default APIError;