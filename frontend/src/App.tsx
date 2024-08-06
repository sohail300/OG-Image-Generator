import { useForm } from "react-hook-form";
import "./App.css";
import { postSchema, postType } from "./types/postTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "./utils/config";

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null);

  const form = useForm<postType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onBlur",
  });

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (e.target.files) {
        setPhoto(e.target.files[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onSubmit(values: postType) {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (photo) {
        formData.append("photo", photo);
      }
      formData.append("title", values.title);
      formData.append("description", values.description);

      const response = await api.post("/test", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      if (response.data.ogImageUrl) {
        setOgImageUrl(response.data.ogImageUrl);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create Your Post
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Fill in the details and upload a photo to generate your OG image
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your title"
                      {...field}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your description"
                      {...field}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <div>
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Photo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="photo"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="photo"
                        name="photo"
                        type="file"
                        className="sr-only"
                        onChange={(e) => handlePhotoChange(e)}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Generate OG Image"}
              </Button>
            </div>
          </form>
        </Form>

        {ogImageUrl && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Generated OG Image
            </h2>
            <img
              src={ogImageUrl}
              alt="OG Image"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
