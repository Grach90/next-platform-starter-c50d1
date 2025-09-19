import type { IGroupCard, IFlower, IPageImage } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://luxerosedubai-001-site1.rtempurl.com/";

export class AdminApiService {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T | null> {
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
  static async getPageImage() {
    const response = await this.request<IPageImage>("api/Page/get-page-image");

    if (response) {
      return response.imageLink;
    }
  }

  static async uploadPageImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("Image", file);

      const response = await fetch(`${API_BASE_URL}api/Page/edit-page-image`, {
        method: "PUT",
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

  static async ActiveInactiveFlower(id: string, isArchive: boolean) {
    const archiveInarchive = !isArchive ? "archive" : "unarchive";
    const response = await fetch(
      `${API_BASE_URL}api/Flower/${archiveInarchive}-flower/${id}`,
      {
        method: "PUT",
      }
    );
    return response.json();
  }
  static async createFlower(flowerData: FormData) {
    const response = await fetch(`${API_BASE_URL}api/Flower/add-flower`, {
      method: "POST",
      body: flowerData,
    });
    return response.json();
  }

  static async updateFlower(id: string, flowerData: FormData) {
    const response = await fetch(`${API_BASE_URL}api/Flower/edit-flower`, {
      method: "PUT",
      body: flowerData,
    });

    return response.json();
  }

  static async deleteFlower(id: string) {
    return this.request(`api/Flower/flower-delete/${id}`, {
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
    if (params.FlowerFilter) {
      queryParams.append("FlowerFilter", params.FlowerFilter);
    } else {
      queryParams.append("FlowerFilter", "all");
    }
    if (params.FlowerGroupId)
      queryParams.append("FlowerGroupId", params.FlowerGroupId);
    if (params.Name) queryParams.append("Name", params.Name);
    if (params.page) queryParams.append("page", params.page.toString());

    const endpoint = `api/Admin/filter-flowers?${queryParams.toString()}`;
    return this.request<IFlower[]>(endpoint);
  }
}
