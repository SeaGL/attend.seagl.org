interface Props {
  id: string;
}

const YouTubeVideo = ({ id }: Props) => {
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0`}
      allow="encrypted-media; picture-in-picture"
      allowFullScreen={true}
    ></iframe>
  );
};

export default YouTubeVideo;
