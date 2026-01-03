export const dynamic = "force-dynamic";

import Link from "next/link";

type PageProps = {
  params: Promise<{ movieid: string }>;
};

async function getMovieDetails(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASEAPIURL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/movie/details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movieid: id }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response from api:", errorText);
    throw new Error(`Failed to fetch movie details. Status: ${res.status}`);
  }

  return res.json();
}

export async function generateMetadata(props: PageProps) {
  const resolvedParams = await props.params;
  const movieid = resolvedParams.movieid;

  const moviedata = await getMovieDetails(movieid);
  return {
    title: `${moviedata.title} - What To Watch`,
  };
}

export default async function MovieDetailsPage(props: PageProps) {
  const resolvedParams = await props.params;
  const movieid = resolvedParams.movieid;

  const moviedata = await getMovieDetails(movieid);

  return (
    <div style={{ padding: "20px" }}>
      {moviedata.belongs_to_collection?.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/original${moviedata.belongs_to_collection.poster_path}`}
          alt={`${moviedata.title} collection poster`}
          style={{ width: "100%", maxHeight: 400, objectFit: "cover", marginTop: 20 }}
        />
      )}

      {moviedata.backdrop_path && (
        <img
          src={`https://image.tmdb.org/t/p/original${moviedata.backdrop_path}`}
          alt={`${moviedata.title} backdrop`}
          style={{ width: "100%", maxHeight: 400, objectFit: "cover", marginTop: 20 }}
        />
      )}

      {moviedata.belongs_to_collection?.backdrop_path && (
        <img
          src={`https://image.tmdb.org/t/p/original${moviedata.belongs_to_collection.backdrop_path}`}
          alt={`${moviedata.title} collection backdrop`}
          style={{ width: "100%", maxHeight: 400, objectFit: "cover", marginTop: 20 }}
        />
      )}

      <img
        src={`https://image.tmdb.org/t/p/w200${moviedata.poster_path}`}
        alt={`${moviedata.title} poster`}
        style={{ borderRadius: 8, marginTop: 20 }}
      />

      <h1 style={{ fontSize: 32, marginTop: 20 }}>{moviedata.title}</h1>
      <p>{moviedata.overview}</p>

      <p><strong>Release Date:</strong> {moviedata.release_date}</p>
      <p>Collection: <b>{moviedata.belongs_to_collection?.name || "None"}</b></p>

      <p>Genres:</p>
      <pre>{JSON.stringify(moviedata.genres, null, 2)}</pre>

      <p><b>Production company:</b> {moviedata.production_companies[0]?.name || "N/A"}</p>
      {moviedata.production_companies[0]?.logo_path && (
        <img
          src={`https://image.tmdb.org/t/p/w200${moviedata.production_companies[0].logo_path}`}
          alt={`${moviedata.title} production logo`}
          style={{ borderRadius: 8, marginTop: 20 }}
        />
      )}

      <p>Movie homepage:</p>
      {moviedata.homepage && (
        <p>
          <Link href={moviedata.homepage}>{moviedata.homepage}</Link>
        </p>
      )}
    </div>
  );
}
