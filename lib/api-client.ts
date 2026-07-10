import { IVideo } from "@/models/video";

export interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" |"DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async myFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
  const error = await response.json().catch(() => null);

  throw new Error(
    error?.message ||
    error?.error ||
    `Request failed with status ${response.status}`
  );
}

    return response.json();
  }

  async addComment(videoId: string, text: string) {
  return this.myFetch<{
    comment: {
      userId: string;
      text: string;
      createdAt: Date;
    };
    commentsCount: number;
  }>(`/videos/${videoId}/comments`, {
    method: "POST",
    body: {
      text,
    },
  });
}

  async toggleLike(videoId: string) {
  return this.myFetch<{
    liked: boolean;
    likesCount: number;
    likes: string[];
  }>(`/videos/${videoId}/like`, {
    method: "PATCH",
  });
}

  async getVideos() {
    return this.myFetch<IVideo[]>("/videos");
  }

  async getVideo(id: string) {
    return this.myFetch<IVideo>(`/videos/${id}`);
  }

  async createVideo(videoData: VideoFormData) {
    return this.myFetch<IVideo>("/videos", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();