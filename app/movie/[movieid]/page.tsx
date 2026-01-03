export const dynamic = "force-dynamic";

import Link from "next/link";

type PageProps = {
  params: { movieid: string };
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

  const data = await res.json();
  return data;
}

export async function generateMetadata({ params }: PageProps) {
  const moviedata = await getMovieDetails(params.movieid);
  return {
    title: moviedata.title + " - What To Watch",
  };
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { movieid } = params;

  const moviedata = await getMovieDetails(movieid);

  return (
    <div style={{ padding: "20px" }}>
      <img
        src={`https://image.tmdb.org/t/p/original${moviedata.belongs_to_collection?.poster_path}`}
        alt={`${moviedata.title} backdrop`}
        title="Front poster"
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          marginTop: "20px",
        }}
      />

      <img
        src={`https://image.tmdb.org/t/p/original${moviedata.backdrop_path}`}
        alt={`${moviedata.title} backdrop`}
        title="Backdoor cover"
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          marginTop: "20px",
        }}
      />

      <img
        src={`https://image.tmdb.org/t/p/original${moviedata.belongs_to_collection?.backdrop_path}`}
        alt={`${moviedata.title} backdrop`}
        title="Backdrop of collection image"
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          marginTop: "20px",
        }}
      />

      <img
        src={`https://image.tmdb.org/t/p/w200${moviedata.poster_path}`}
        alt={`${moviedata.title} poster`}
        style={{ borderRadius: "8px", marginTop: "20px" }}
      />

      <h1 style={{ fontSize: "2rem", marginTop: "20px" }}>{moviedata.title}</h1>
      <p>{moviedata.overview}</p>
      <p>
        <strong>Release Date:</strong> {moviedata.release_date}
      </p>

      <p>
        This movie belongs to collection:{" "}
        <b>{moviedata.belongs_to_collection?.name || "None"}</b>
      </p>

      <p>Genres:</p>
      <pre>{JSON.stringify(moviedata.genres, null, 2)}</pre>

      <p>
        <b>Production company:</b>
      </p>
      <p>{moviedata.production_companies[0]?.name}</p>
      <img
        src={`https://image.tmdb.org/t/p/w200${moviedata.production_companies[0]?.logo_path}`}
        alt={`${moviedata.title} production company logo`}
        style={{ borderRadius: "8px", marginTop: "20px" }}
      />

      <p>Movie homepage:</p>
      <p>
        <Link href={moviedata.homepage}>page of the movie</Link>
      </p>

      {/* <p>
        <pre>{JSON.stringify(moviedata, null, 2)}</pre>
      </p> */}
    </div>
  );
}
