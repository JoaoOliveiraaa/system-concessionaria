import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

// Create a service role client that bypasses RLS
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select(`
        *,
        media (
          id,
          url,
          type,
          order
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    
    // Order media by order field for each vehicle
    const vehiclesWithOrderedMedia = data?.map(vehicle => ({
      ...vehicle,
      media: vehicle.media?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    }))
    
    return NextResponse.json(vehiclesWithOrderedMedia)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { media, ...vehicleData } = body
    
    console.log('POST - Received media:', media)
    console.log('POST - Vehicle data:', vehicleData)
    
    // Insert vehicle first
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .insert([vehicleData])
      .select()
      .single()

    if (vehicleError) {
      console.error("Vehicle insert error:", vehicleError)
      throw vehicleError
    }

    console.log('POST - Vehicle created:', vehicle.id)

    // If media exists, insert media records
    if (media && media.length > 0) {
      const mediaRecords = media.map((m: any, index: number) => ({
        vehicle_id: vehicle.id,
        url: m.url,
        type: m.type,
        order: index
      }))

      console.log('POST - Inserting media records:', mediaRecords)

      const { error: mediaError } = await supabase
        .from("media")
        .insert(mediaRecords)

      if (mediaError) {
        console.error("Media insert error:", mediaError)
        throw mediaError
      }
      
      console.log('POST - Media inserted successfully')
    } else {
      console.log('POST - No media to insert')
    }

    // Fetch complete vehicle with media
    const { data: completeVehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select(`
        *,
        media (
          id,
          url,
          type,
          order
        )
      `)
      .eq("id", vehicle.id)
      .single()

    if (fetchError) throw fetchError
    
    // Order media by order field
    if (completeVehicle.media) {
      completeVehicle.media.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    }

    return NextResponse.json(completeVehicle, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, media, ...updateData } = body

    console.log('PUT - Vehicle ID:', id)
    console.log('PUT - Received media:', media)
    console.log('PUT - Update data:', updateData)

    // Update vehicle data
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (vehicleError) {
      console.error("Vehicle update error:", vehicleError)
      throw vehicleError
    }

    console.log('PUT - Vehicle updated successfully')

    // Handle media updates if provided
    if (media !== undefined) {
      console.log('PUT - Deleting existing media for vehicle:', id)
      // Delete existing media
      await supabase.from("media").delete().eq("vehicle_id", id)

      // Insert new media records
      if (media.length > 0) {
        const mediaRecords = media.map((m: any, index: number) => ({
          vehicle_id: id,
          url: m.url,
          type: m.type,
          order: index
        }))

        console.log('PUT - Inserting new media records:', mediaRecords)

        const { error: mediaError } = await supabase
          .from("media")
          .insert(mediaRecords)

        if (mediaError) {
          console.error("Media insert error:", mediaError)
          throw mediaError
        }
        
        console.log('PUT - Media updated successfully')
      } else {
        console.log('PUT - No new media to insert')
      }
    } else {
      console.log('PUT - Media not provided, skipping update')
    }

    // Fetch complete vehicle with media
    const { data: completeVehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select(`
        *,
        media (
          id,
          url,
          type,
          order
        )
      `)
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError
    
    // Order media by order field
    if (completeVehicle.media) {
      completeVehicle.media.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    }

    return NextResponse.json(completeVehicle)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("vehicles").delete().eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
