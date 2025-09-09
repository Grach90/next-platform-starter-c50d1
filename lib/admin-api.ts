import type { IGroupCard, IFlower } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://luxerosedubai.somee.com/";
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export class AdminApiService {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T | null> {
    if (USE_MOCK_DATA) {
      return null; // Signal to use mock data
    }

    const url = `${API_BASE_URL}${endpoint}`;

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
      console.log(`API request failed for ${endpoint}, using mock data`);
      return null; // Signal to use mock data
    }
  }

  // Homepage Image Management
  static async getPageImage(): Promise<string> {
    const response = await this.request<{ imageUrl: string }>(
      "/api/Page/get-page-image"
    );

    if (response) {
      return response.imageUrl;
    }

    // Use mock data
    return "/placeholder-hc4o3.png";
  }

  static async uploadPageImage(file: File): Promise<string> {
    if (USE_MOCK_DATA) {
      console.log("Mock upload:", file.name);
      return URL.createObjectURL(file);
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE_URL}/api/Page/edit-page-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      return result.imageUrl;
    } catch (error) {
      console.log("Mock upload:", file.name);
      return URL.createObjectURL(file);
    }
  }

  static async removePageImage(): Promise<void> {
    const response = await this.request("/api/Page/remove-page-image", {
      method: "DELETE",
    });

    if (!response) {
      console.log("Mock image removal");
    }
  }

  // Flowers Management
  static async getAllFlowerGroups() {
    return this.request<IGroupCard[]>("api/FlowerGroup/get-all-flower-groups");
  }

  static async getAllFlowers() {
    return this.request<IFlower[]>("api/Flower/get-all-flowers?lang=en");
  }

  static async createFlower(flowerData: Omit<IFlower, "id">) {
    return this.request<IFlower>("api/Flower/create", {
      method: "POST",
      body: JSON.stringify(flowerData),
    });
  }

  static async updateFlower(id: string, flowerData: Partial<IFlower>) {
    return this.request<IFlower>(`api/Flower/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(flowerData),
    });
  }

  static async deleteFlower(id: string) {
    return this.request(`/api/Flower/flower-delete/${id}`, {
      method: "DELETE",
    });
  }

  static async filterFlowers(params: {
    FlowerFilter?: string;
    FlowerGroupId?: string;
    Name?: string;
    page?: number;
  }): Promise<IFlower[] | null> {
    const queryParams = new URLSearchParams();
    if (params.FlowerFilter)
      queryParams.append("FlowerFilter", params.FlowerFilter);
    if (params.FlowerGroupId)
      queryParams.append("FlowerGroupId", params.FlowerGroupId);
    if (params.Name) queryParams.append("Name", params.Name);
    if (params.page) queryParams.append("pageSize", params.page.toString());

    const endpoint = `api/Admin/filter-flowers?${queryParams.toString()}`;
    return this.request<IFlower[]>(endpoint);
  }
}
