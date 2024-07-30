import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNevigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";

const HomePage = () => {
  let [blogs, setBlog] = useState(null);
  let [trendingBlogs, setTrendingBlog] = useState(null);
  let [pageState, setPageState] = useState("home");

  let categories = [
    "programming",
    "hollywood",
    "film making",
    "Social Media",
    "Cooking",
    "Tech",
    "Finance",
    "Travel",
  ];

  const fetchLatestBlogs = (page = 2) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(async ({ data }) => {
        console.log(data.blogs);

        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });

        //all-latest-blogs-count

        console.log(formatedData);

        setBlog(formatedData);
      })
      .catch((err) => {
        console.error("Error fetching latest blogs:", err);
      });
  };

  const fetchBlogsByCategory = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
      })
      .then(({ data }) => {
        console.log("Latest blogs data:", data);
        setBlog(data.blogs);
      })
      .catch((err) => {
        console.error("Error fetching latest blogs:", err);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        console.log("Trending blogs data:", data); // Log the response data
        setTrendingBlog(data); // Ensure this matches the response structure
      })
      .catch((err) => {
        console.error("Error fetching trending blogs:", err);
      });
  };

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
    setBlog(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState == "home") {
      fetchLatestBlogs();
    } else {
      fetchBlogsByCategory();
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNevigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No blog is releted to this topic" />
              )}
            </>

            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No Trending Blogs found" />
            )}
          </InPageNevigation>

          {/* filter and trending blogs */}
        </div>

        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                stories from all interests
              </h1>

              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadBlogByCategory}
                      className={
                        "tag " +
                        (pageState == category ? " bg-black text-white " : " ")
                      }
                      key={i}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending
                <i class="fi fi-bs-arrow-trend-up"></i>
              </h1>
              {trendingBlogs == null ? (
                <Loader />
              ) : (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
