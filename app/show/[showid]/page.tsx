export const dynamic = "force-dynamic";
import Link from "next/link";

type PageProps = {
  params: Promise<{ showid: string }>;
};

async function getShowDetails(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASEAPIURL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/show/details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ showid: id }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response from api:", errorText);
    throw new Error(`Failed to fetch movie details. Status: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export async function generateMetadata({ params }: PageProps) {
  const showData = await getShowDetails((await params).showid);
  return {
    title: showData.name + " - What To Watch",
  };
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { showid } = await params;

  const showdata = await getShowDetails(showid);

  return (
    <div style={{ padding: "20px" }}>
      <img
        src={`https://image.tmdb.org/t/p/original${showdata.backdrop_path}`}
        alt={`${showdata.title} backdrop`}
        title="Front poster"
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          marginTop: "20px",
          objectPosition: "top",
        }}
      />
      <img
        src={`https://image.tmdb.org/t/p/original${showdata.poster_path}`}
        alt={`poster`}
        style={{
          width: "auto",
          height: "400px",
          objectFit: "cover",
          objectPosition: "top",
        }}
      />

      <h2>{showdata.name}</h2>
      <p>{showdata.overview}</p>
      <p>
        <Link href={showdata.homepage}>Show page</Link>
      </p>

      {/* <p>Data:</p>
       <pre>{JSON.stringify(showdata, null, 2)}</pre> */}
    </div>
  );
}
