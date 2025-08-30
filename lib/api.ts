import type { IGroupCard, IFlower, IFilterParams } from "./types" // Assuming these types are declared in a separate file

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://luxerosedubai.somee.com/"

export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = endpoint;
  console.log(url,"url");
  
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request error:", error)
      throw error
    }
  }

  static async getAllFlowerGroups() {
    return this.request<IGroupCard[]>("/api/FlowerGroup/get-all-flower-groups")
  }

  static async getFlowersByGroup(groupId: string) {
    return this.request<IFlower[]>(`/api/FlowerGroup/get-flowers-by-flower-group/${groupId}`)
  }
  static async getFlowerById(groupId: string) {
    return this.request<IFlower>(`/api/Flower/get-flower-by-id/${groupId}`)
  }

  static async filterFlowers(params: IFilterParams) {
    const searchParams = new URLSearchParams()

    if (params.flowerName) searchParams.append("flowerName", params.flowerName)
    if (params.bouqetType) searchParams.append("bouqetType", params.bouqetType.toString())
    if (params.size) searchParams.append("size", params.size.toString())
    if (params.minPrice) searchParams.append("minPrice", params.minPrice.toString())
    if (params.maxPrice) searchParams.append("maxPrice", params.maxPrice.toString())
    if (params.colors?.length) {
      params.colors.forEach((color) => searchParams.append("colors", color.toString()))
    }
    if (params.kinds?.length) {
      params.kinds.forEach((kind) => searchParams.append("kinds", kind.toString()))
    }

    return this.request<IFlower[]>(`api/Flower/filter?${searchParams.toString()}`)
  }
}
