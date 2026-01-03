export const dynamic = "force-dynamic";
import Link from "next/link";
import getShowDetails from "./getShowDetails";
import type { PageProps } from "./types";

type Season = {
  id: number;
  name: string;
  season_number: number;
  air_date: string | null;
  episode_count: number;
  overview: string;
  poster_path: string | null;
  vote_average: number;
};

export async function generateMetadata({ params }: PageProps) {
  const showData = await getShowDetails((await params).showid);
  return {
    title: showData.name + " - What To Watch",
  };
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { showid } = await params;

  const showdata = await getShowDetails(showid);
  const seasons: Season[] = showdata.seasons ?? [];
  // console.log(showdata);

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
      <p>Aired date: {showdata.first_air_date}</p>
      <p>
        <Link href={showdata.homepage}>Show page</Link>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {seasons.map((season) => (
          <div
            key={season.id}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#111",
              color: "#fff",
            }}
          >
            {season.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
                alt={season.name}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                }}
              />
            )}
            <div style={{ padding: "12px" }}>
              <h3 style={{ margin: "0 0 6px 0" }}>{season.name}</h3>
              <p style={{ margin: "0", fontSize: "0.9rem", opacity: 0.8 }}>
                Episodes: {season.episode_count}
              </p>
              <p style={{ margin: "4px 0", fontSize: "0.9rem", opacity: 0.8 }}>
                Air date: {season.air_date || "N/A"}
              </p>
              <p style={{ margin: "4px 0", fontSize: "0.9rem" }}>
                ⭐ {season.vote_average || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* <p>Data:</p>
       <pre>{JSON.stringify(showdata, null, 2)}</pre> */}
    </div>
  );
}
