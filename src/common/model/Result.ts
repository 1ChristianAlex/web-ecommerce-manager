class Result<T = null> {
	constructor(
		public result: T,
		public errorMessage: Error | null,
	) {}
}

export { Result };
