class Fence {
	/**
	 * task list
	 */
	tasks: (() => Promise<any>)[] = []

	/**
	 * result for each task
	 */
	results: any[] = []

	/**
	 * error for each task
	 */
	errors: Error[] = []

	state: 'pending' | 'fulfilled' | 'rejected' | 'partiallyRejected' = 'pending'
	fired: boolean = false

	addTask(task: () => Promise<any>): number /** Task ID */ {
		if (this.fired) {
			throw new Error('This fence has been fired. Can not add more task to it.')
		}

		const pointer = this.tasks.length

		const wrappedTask = async () => {
			try {
				const result = await task()
				this.results[pointer] = result
			} catch (error) {
				this.errors[pointer] = error
			}
		}

		this.tasks.push(wrappedTask)

		return pointer
	}

	addTaskPromsise(task: (resolve, reject) => void): number /** Task ID */ {
		if (this.fired) {
			throw new Error('This fence has been fired. Can not add more task to it.')
		}

		const pointer = this.tasks.length

		const wrappedTask = async () => {
			try {
				const promise = new Promise((resolve, reject) => {
					task(resolve, reject)
				})
				const result = await promise
				this.results[pointer] = result
			} catch (error) {
				this.errors[pointer] = error
			}
		}

		this.tasks.push(wrappedTask)

		return pointer
	}

	/**
	 * @todo error handling
	 */
	async done(needsAll = false) {
		if (this.fired) {
			throw new Error('This fence has been fired. Can not fire again.')
		}

		this.fired = true

		try {
			await Promise.all(this.tasks.map((f) => f()))
			this.state = 'fulfilled'
		} catch (error) {}

		return this.results
	}

	getResult(taskID: number) {
		if (this.state === 'pending' || this.state === 'rejected') {
			throw new Error('Results not ready')
		}

		return this.results[taskID]
	}

	getError(taskID: number) {
		if (this.state === 'pending') {
			throw new Error('Errors not ready')
		}
		return this.errors[taskID]
	}
}
