export const fetchBlogPostsGithubAPI = async <T>(url: string) => {
  const response = await fetch(
    `https://api.github.com/repos/centraldogma99/dogma-blog-posts${url}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );
  return (await response.json()) as T;
};
