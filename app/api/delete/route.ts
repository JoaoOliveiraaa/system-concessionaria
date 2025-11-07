import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

// Create Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // Extract file path from URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/media/vehicles/filename.jpg
    const urlParts = url.split('/storage/v1/object/public/media/')
    if (urlParts.length < 2) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }
    
    const filePath = urlParts[1]

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from('media')
      .remove([filePath])

    if (error) {
      console.error("Supabase delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
