import React, { useRef } from "react";

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
  onClick,
}) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const div = cardRef.current;
    const rect = div.getBoundingClientRect();

    // Calculate mouse position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update CSS variables directly on the element
    div.style.setProperty("--mouse-x", `${x}px`);
    div.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className="movie-card group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={onClick}
      onMouseMove={handleMouseMove}
    >
      {/* --- THE GLOWING POINTER LAYER --- */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(
            600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
            rgba(139, 92, 246, 0.15),
            transparent 40%
          )`,
        }}
      />

      {/* Optional: A subtle border glow that also follows mouse (Glassmorphism border) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(
              400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
              rgba(255, 255, 255, 0.1),
              transparent 40%
            )`,
          maskImage: "linear-gradient(#fff, #fff), linear-gradient(#fff, #fff)",
          maskClip: "content-box, border-box",
          maskComposite: "exclude",
          padding: "1px", // This defines the border width
        }}
      />

      {/* --- CONTENT --- */}
      {/* Added z-30 to ensure content sits above the glow */}
      <div className="relative z-30">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "/no-movie.png"
          }
          alt={title}
          className="rounded-lg shadow-lg"
        />

        <div className="mt-4">
          <h3>{title}</h3>

          <div className="content">
            <div className="rating">
              <img src="star.svg" alt="Star Icon" />
              <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            </div>

            <span>•</span>
            <p className="lang capitalize">{original_language}</p>

            <span>•</span>
            <p className="year">
              {release_date ? release_date.split("-")[0] : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
