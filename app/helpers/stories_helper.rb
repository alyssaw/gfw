module StoriesHelper

  def previous_page_link(page)
    page -= 1
    stories_path(:page => page)
  end

  def next_page_link(page)
    page += 1
    stories_path(:page => page)
  end

  def last_page?
    @page == @total_pages
  end

  def story_image_or_map(thumbnail_url, coords)
    return thumbnail_url if thumbnail_url.present?

    static_map(coords)
  end

  def static_map(coords, size="266x266", zoom="3")
    "http://maps.google.com/maps/api/staticmap?center=#{coords.to_s.gsub(" ", "")}&zoom=#{zoom}&size=#{size}&maptype=terrain&sensor=false"
  end

  def youtube_embed(youtube_url)
    if youtube_url[/youtu\.be\/([^\?]*)/]
      youtube_id = $1
    else
      # Regex from # http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url/4811367#4811367
      youtube_url[/^.*((v\/)|(embed\/)|(watch\?))\??v?=?([^\&\?]*).*/]
      youtube_id = $5
    end

    %Q(<iframe width="483" height="362" src="//www.youtube.com/embed/#{youtube_id}" frameborder="0" allowfullscreen></iframe>)
  end

end