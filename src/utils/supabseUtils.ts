import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_STORAGE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

const uploadSupabaseImage = async (file: any, imageName: string) => {
  const { data, error: uploadError } = await supabase.storage
    .from("teacherimages")
    .upload(imageName, file, { contentType: "image/png" });
  if (uploadError) {
    console.log("Error while uploading image", uploadError);
  } else {
    console.log("Image uploaded successfully");
  }

  return uploadError;
};

export { uploadSupabaseImage };
