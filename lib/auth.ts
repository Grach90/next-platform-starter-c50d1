interface AuthData {
  username: string
  token?: string
  isAuthenticated: boolean
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://luxerosedubai.somee.com/";

export class AuthService {
  private static readonly COOKIE_NAME = "admin_auth"
  private static readonly COOKIE_EXPIRY_DAYS = 1

  static async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          password: password,
        }),
      })
      
      if (response.ok) {
          console.log(response,"resposne");
        //   const data = await response.json()

        // Store auth data in cookie
        const authData: AuthData = {
          username,
          token:  "authenticated",
          isAuthenticated: true,
        }

        this.setAuthCookie(authData)
        return { success: true }
      } else {
        return { success: false, error: "Invalid username or password" }
      }
    } catch (error) {
      // Mock authentication for development
    //   if (username === "admin" && password === "secret") {
    //     const authData: AuthData = {
    //       username,
    //       token: "mock-token",
    //       isAuthenticated: true,
    //     }
    //     this.setAuthCookie(authData)
    //     return { success: true }
    //   }

      return { success: false, error: "Invalid username or password" }
    }
  }

  static async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}api/Auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          oldPassword,
          newPassword,
        }),
      })

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: "Failed to change password" }
      }
    } catch (error) {
      // Mock password change for development
      return { success: true }
    }
  }

  static logout(): void {
    this.clearAuthCookie()
  }

  static isAuthenticated(): boolean {
    const authData = this.getAuthData()
    return authData?.isAuthenticated || false
  }

  static getAuthData(): AuthData | null {
    if (typeof window === "undefined") return null

    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${this.COOKIE_NAME}=`))
      ?.split("=")[1]

    if (!cookieValue) return null

    try {
      return JSON.parse(decodeURIComponent(cookieValue))
    } catch {
      return null
    }
  }

  private static setAuthCookie(authData: AuthData): void {
    if (typeof window === "undefined") return

    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + this.COOKIE_EXPIRY_DAYS)

    document.cookie = `${this.COOKIE_NAME}=${encodeURIComponent(JSON.stringify(authData))}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`
  }

  private static clearAuthCookie(): void {
    if (typeof window === "undefined") return

    document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
  }
}
