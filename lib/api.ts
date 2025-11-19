import type { IGroupCard, IFlower, IFilterParams } from "./types"; // Assuming these types are declared in a separate file

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://luxerosedubai-001-site1.rtempurl.com/";

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(url, "url");

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  static async getAllFlowerGroups(currentLanguage: string) {

    return this.request<IGroupCard[]>(
      `api/FlowerGroup/get-all-flower-groups?lang=${currentLanguage}`
    );
  }

  static async getFlowersByGroup(groupId: string, currentLanguage: string) {
    return this.request<IFlower[]>(
      `api/FlowerGroup/get-flowers-by-flower-group/${groupId}?${currentLanguage}`
    );
  }
  static async getFlowerById(groupId: string, currentLanguage: string) {
    return this.request<IFlower>(
      `api/Flower/get-flower-by-id/${groupId}?lang=${currentLanguage}`
    );
  }

  static async filterFlowers(params: IFilterParams, currentLanguage: string) {
    const searchParams = new URLSearchParams();

    if (params.flowerName) searchParams.append("flowerName", params.flowerName);
    if (params.bouqetType)
      searchParams.append("bouqetType", params.bouqetType.toString());
    if (params.size) searchParams.append("size", params.size.toString());
    if (params.minPrice)
      searchParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      searchParams.append("maxPrice", params.maxPrice.toString());
    if (params.colors?.length) {
      params.colors.forEach((color) =>
        searchParams.append("colors", color.toString())
      );
    }
    if (params.kinds?.length) {
      params.kinds.forEach((kind) =>
        searchParams.append("kinds", kind.toString())
      );
    }
    if(params.page) {
      searchParams.append("page", params.page.toString())
    }
    if(params.perPage) {
       searchParams.append("pageSize", params.perPage.toString())
    }

    return this.request<IFlower[]>(
      `api/Flower/filter?${searchParams.toString()}&lang=${currentLanguage}`
    );
  }
  static async getPgeImge() {
    return this.request<string>(`api/Page/get-page-image`);
  }
}
