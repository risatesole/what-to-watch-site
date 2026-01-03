import Card from "@/components/card";
import type { CardData } from "@/components/card";
import styles from "./styles.module.css";
import Navbar from "@/components/navbar";

function CardsPopularMovies({ cards }: { cards: CardData[] }) {
  return (
    <div className={styles.cardsection}>
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          posterimageurl={card.posterimageurl}
          redirecturl={card.redirecturl}
          overview={card.overview}
        />
      ))}
    </div>
  );
}

function CardsPopularTvShows({ cards }: { cards: CardData[] }) {
  return (
    <div className={styles.cardsection}>
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          posterimageurl={card.posterimageurl}
          redirecturl={card.redirecturl}
          overview={card.overview}
        />
      ))}
    </div>
  );
}

async function getPopularTvshows() {
  const baseUrl = process.env.NEXT_PUBLIC_BASEAPIURL ?? "http://127.0.0.1:3000";
  const res = await fetch(`${baseUrl}/api/popular/shows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeholder: "myplaceholder" }),
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

async function getPopularMovies() {
  const baseUrl = process.env.NEXT_PUBLIC_BASEAPIURL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/popular/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeholder: "myplaceholder" }),
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

type ShowItem = {
  id: number;
  name: string;
  poster_path: string;
  overview: string;
};

type MovieItem = {
  id: number;
  name: string;
  poster_path: string;
  overview: string;
};

export default async function PopularPage() {
  const tvShowData = await getPopularTvshows();
  const moviesData = await getPopularMovies();

  const showsCardData = tvShowData.results.map((item: ShowItem) => ({
    title: item.name,
    posterimageurl: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
    redirecturl: `/show/${item.id}`,
    overview: `${item.overview}`,
  }));

  const moviesCardData = moviesData.results.map((item: MovieItem) => ({
    title: item.name,
    posterimageurl: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
    redirecturl: `/movie/${item.id}`,
    overview: `${item.overview}`,
  }));

  return (
    <div>
            <Navbar
              brand="What to Watch"
              links={[
                { label: "Home", href: "/" },
          { label: "popular", href: "/popular" }
              ]}
            />

      <h2>Welcome to the popular content page</h2>
      <h3>Popular tv shows: </h3>
      <CardsPopularTvShows cards={showsCardData} />
      <h3>Popular movies:</h3>
      <CardsPopularMovies cards={moviesCardData} />

      {/* 
      <p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </p> 
      */}
    </div>
  );
}
