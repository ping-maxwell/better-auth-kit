export const GithubUser = ({ children: username }: { children: string }) => {
  return (
      <a
        href={`https://github.com/${username}`}
        rel="noreferrer noopener"
        target="_blank"
        className="font-normal"
      >
        <img
          className="rounded-full w-6 h-6 border  m-0! mr-1! inline"
          src={`https://github.com/${username}.png`}
          alt={`${username}'s Github avatar`}
        />
        {username}
      </a>
  );
};
