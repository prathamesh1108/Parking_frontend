/**
 * Extracts a user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof (error as any).message === "string") {
      return (error as any).message
    }

    if ("error" in error && typeof (error as any).error === "string") {
      return (error as any).error
    }

    return JSON.stringify(error)
  }

  return "An unknown error occurred"
}

/**
 * Creates a standardized error object with additional properties
 */
export function createApiError(message: string, status?: number): Error {
  const error = new Error(message)
  if (status) {
    ;(error as any).status = status
  }
  return error
}

