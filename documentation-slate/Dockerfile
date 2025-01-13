FROM ruby:2.6-slim

WORKDIR /srv/slate

COPY Gemfile .
COPY Gemfile.lock .

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        git \
        nodejs \
    && gem install bundler -v 2.4.22 \
    && bundle config force_ruby_platform true \
    && bundle install \
    && apt-get remove -y build-essential git \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

COPY . /srv/slate

EXPOSE 4567

ENTRYPOINT ["bundle", "exec", "middleman"]
CMD ["server"]