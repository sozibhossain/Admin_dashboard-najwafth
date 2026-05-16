"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminMetricCard, AdminPageFrame, AdminSectionCard } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/lib/api";
import { getAssetUrl } from "@/lib/utils";

type Category = {
  _id: string;
  name: string;
  color?: string;
  level?: number;
  productCount?: number;
  parent?: {
    _id?: string;
    name?: string;
  } | null;
  image?: {
    url?: string;
  };
};

type CategoryFormState = {
  name: string;
  color: string;
  parent: string;
};

const emptyForm: CategoryFormState = {
  name: "",
  color: "#6d98c0",
  parent: "",
};
const emptyCategories: Category[] = [];

function CategoryModal({
  open,
  title,
  initial,
  categories,
  submitting,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  initial: CategoryFormState & { image?: string };
  categories: Category[];
  submitting: boolean;
  onClose: () => void;
  onSubmit: (form: CategoryFormState, file: File | null) => void;
}) {
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState<File | null>(null);
  const preview = file ? URL.createObjectURL(file) : initial.image;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[720px] rounded-[18px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-[24px] font-semibold text-[#202124]">{title}</h2>
            <p className="mt-1 text-[15px] text-[#5b6371]">Manage book categories for sellers and books.</p>
          </div>
          <button onClick={onClose} type="button" className="text-[#5b6371]">
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-[220px_1fr]">
          <div>
            <p className="mb-2 text-[14px] font-medium text-[#202124]">Category Image</p>
            <label className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border border-dashed border-[#6d98c0]/40 bg-[#f8fafc]">
              {preview ? <Image src={preview} alt="Category" fill className="object-cover" sizes="220px" /> : null}
              <div className="relative z-10 flex flex-col items-center text-center text-[#6d98c0]">
                <Upload className="size-6" />
                <p className="mt-2 text-[13px] font-medium">Upload image</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#202124]">Category Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Fiction" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#202124]">Parent Category</label>
                <select
                  className="h-12 w-full rounded-[10px] border border-[#cfd4dc] bg-white px-4 text-[14px] text-[#202124]"
                  value={form.parent}
                  onChange={(e) => setForm({ ...form, parent: e.target.value })}
                >
                  <option value="">No parent</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#202124]">Color</label>
                <div className="flex h-12 items-center gap-3 rounded-[10px] border border-[#cfd4dc] px-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="h-7 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="text-[14px] text-[#202124]">{form.color}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button className="bg-[#6d98c0] hover:bg-[#5f88ae]" disabled={submitting} onClick={() => onSubmit(form, file)} type="button">
            {submitting ? "Saving..." : "Save Category"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn: () => getCategories({ includeProducts: true }),
  });

  const categories = categoriesQuery.data || emptyCategories;

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created.");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setOpenCreate(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateCategory(id, formData),
    onSuccess: () => {
      toast.success("Category updated.");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const metrics = useMemo(() => {
    const total = categories.length;
    const root = categories.filter((category) => !category.parent?._id).length;
    const withBooks = categories.filter((category) => (category.productCount || 0) > 0).length;
    return { total, root, withBooks };
  }, [categories]);

  const handleSubmit = (form: CategoryFormState, file: File | null, current?: Category | null) => {
    if (!form.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    const formData = new FormData();
    formData.set("name", form.name);
    formData.set("color", form.color);
    if (form.parent) {
      formData.set("parent", form.parent);
    }
    if (file) {
      formData.set("image", file);
    }

    if (current?._id) {
      updateMutation.mutate({ id: current._id, formData });
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <AdminPageFrame title="Categories" subtitle="Add, edit, delete, and review book categories">
      <div className="grid gap-4 lg:grid-cols-3">
        <AdminMetricCard label="Total Categories" value={metrics.total} accent="blue" />
        <AdminMetricCard label="Root Categories" value={metrics.root} accent="amber" />
        <AdminMetricCard label="Categories In Use" value={metrics.withBooks} accent="green" />
      </div>

      <AdminSectionCard className="mt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[24px] font-semibold text-[#202124]">Category List</h2>
            <p className="mt-1 text-[15px] text-[#5b6371]">These categories are available in the seller dashboard book form.</p>
          </div>
          <Button className="bg-[#6d98c0] hover:bg-[#5f88ae]" onClick={() => setOpenCreate(true)}>
            <Plus className="size-4" /> Add Category
          </Button>
        </div>

        {categoriesQuery.isLoading ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-[180px] rounded-[16px] border-[#dfe3ea] shadow-none" />
            ))}
          </div>
        ) : null}

        {!categoriesQuery.isLoading && categories.length === 0 ? (
          <Card className="mt-6 rounded-[16px] border-dashed border-[#cfd4dc] p-10 text-center shadow-none">
            <h3 className="text-[20px] font-semibold text-[#202124]">No categories yet</h3>
            <p className="mt-2 text-[15px] text-[#5b6371]">Create the first category so sellers can assign it when adding books.</p>
          </Card>
        ) : null}

        {!categoriesQuery.isLoading && categories.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
              const image = getAssetUrl(category.image);
              return (
                <Card key={category._id} className="rounded-[16px] border-[#dfe3ea] p-4 shadow-none">
                  <div className="flex items-start gap-4">
                    <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#f3f4f6]">
                      {image ? (
                        <Image src={image} alt={category.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <span className="text-[22px] font-semibold text-[#6d98c0]">{category.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[18px] font-semibold text-[#202124]">{category.name}</h3>
                          <p className="mt-1 text-[13px] text-[#5b6371]">
                            Parent: {category.parent?.name || "Top level"}
                          </p>
                        </div>
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-[12px] font-medium"
                          style={{
                            backgroundColor: `${category.color || "#6d98c0"}20`,
                            color: category.color || "#6d98c0",
                          }}
                        >
                          Level {category.level ?? 0}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-[13px] text-[#5b6371]">
                        <div className="rounded-[12px] bg-[#f8fafc] px-3 py-2">
                          <p>Books</p>
                          <p className="mt-1 text-[16px] font-semibold text-[#202124]">{category.productCount || 0}</p>
                        </div>
                        <div className="rounded-[12px] bg-[#f8fafc] px-3 py-2">
                          <p>Color</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className="inline-block size-4 rounded-full border border-black/10"
                              style={{ backgroundColor: category.color || "#6d98c0" }}
                            />
                            <span className="text-[14px] font-medium text-[#202124]">{category.color || "#6d98c0"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="border-[#3d8ef5] text-[#3d8ef5]"
                          onClick={() => setEditing(category)}
                        >
                          <Pencil className="size-4" /> Edit
                        </Button>
                        <Button
                          className="bg-[#fde7e7] text-[#d92d20] hover:bg-[#fbd1d1]"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            if (window.confirm(`Delete "${category.name}"?`)) {
                              deleteMutation.mutate(category._id);
                            }
                          }}
                        >
                          <Trash2 className="size-4" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : null}
      </AdminSectionCard>

      <CategoryModal
        key={openCreate ? "create-open" : "create-closed"}
        open={openCreate}
        title="Add Category"
        initial={{ ...emptyForm }}
        categories={categories}
        submitting={createMutation.isPending}
        onClose={() => setOpenCreate(false)}
        onSubmit={(form, file) => handleSubmit(form, file)}
      />

      <CategoryModal
        key={editing ? editing._id : "edit-closed"}
        open={!!editing}
        title="Edit Category"
        initial={{
          name: editing?.name || "",
          color: editing?.color || "#6d98c0",
          parent: editing?.parent?._id || "",
          image: getAssetUrl(editing?.image) || undefined,
        }}
        categories={categories.filter((category) => category._id !== editing?._id)}
        submitting={updateMutation.isPending}
        onClose={() => setEditing(null)}
        onSubmit={(form, file) => handleSubmit(form, file, editing)}
      />
    </AdminPageFrame>
  );
}
