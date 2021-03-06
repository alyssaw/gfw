module Api
  class Blog
    include HTTParty

    base_uri "http://blog.globalforestwatch.org"

    def self.find_post_by_country(name)
      options = { :query => {
                              :tag => name,
                              :feed => "rss2"
                            }
                }

      response = get('/', options)

      if response.success?
        response['rss']['channel']['item']
      else
        nil
      end
    end
  end
end
