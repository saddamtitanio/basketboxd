


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_game_leaderboard"("p_game_id" "uuid", "p_limit" integer DEFAULT 10) RETURNS TABLE("player_id" "uuid", "avg_rating" numeric, "total_ratings" bigint, "full_name" "text", "image_url" "text", "team_id" "uuid", "team_name" "text", "team_logo_url" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY

  SELECT
    pr.player_id::uuid,

    ROUND(AVG(pr.rating)::numeric, 2)::numeric AS avg_rating,

    COUNT(*)::bigint AS total_ratings,

    p.full_name::text,
    p.image_url::text,
    p.team_id::uuid,

    t.name::text AS team_name,
    t.logo_url::text AS team_logo_url

  FROM player_ratings pr

  JOIN players p
    ON p.id = pr.player_id

  JOIN teams t
    ON t.id = p.team_id

  WHERE pr.game_id = p_game_id

  GROUP BY
    pr.player_id,
    p.full_name,
    p.image_url,
    p.team_id,
    t.name,
    t.logo_url

  ORDER BY avg_rating DESC

  LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_game_leaderboard"("p_game_id" "uuid", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.created_at
  );

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_games"("search_query" "text" DEFAULT NULL::"text", "filter_team_id" "uuid" DEFAULT NULL::"uuid", "filter_season" "text" DEFAULT NULL::"text", "filter_arena" "text" DEFAULT NULL::"text", "filter_status" "text" DEFAULT NULL::"text", "filter_date" "date" DEFAULT NULL::"date", "filter_start_date" timestamp without time zone DEFAULT NULL::timestamp without time zone, "filter_end_date" timestamp without time zone DEFAULT NULL::timestamp without time zone) RETURNS TABLE("id" "uuid", "game_date" timestamp without time zone, "season" "text", "arena" "text", "status" "text", "home_score" integer, "away_score" integer, "image_url" "text", "home_team" "jsonb", "away_team" "jsonb", "rating" numeric, "review_count" bigint)
    LANGUAGE "sql" STABLE
    AS $$
    select
        g.id,
        g.game_date,
        g.season,
        g.arena,
        g.status,
        g.home_score,
        g.away_score,
        g.image_url,
        jsonb_build_object(
            'id',           ht.id,
            'name',         ht.name,
            'city',         ht.city,
            'abbreviation', ht.abbreviation,
            'logo_url',     ht.logo_url
        ) as home_team,
        jsonb_build_object(
            'id',           at.id,
            'name',         at.name,
            'city',         at.city,
            'abbreviation', at.abbreviation,
            'logo_url',     at.logo_url
        ) as away_team,
        nullif(avg(r.rating), 0)   as rating,
        nullif(count(r.id), 0)     as review_count
    from games g
    join teams ht on ht.id = g.home_team_id
    join teams at on at.id = g.away_team_id
    left join reviews r on r.game_id = g.id
    where
        (
            search_query is null
            or g.arena ilike '%' || search_query || '%'
            or ht.name ilike '%' || search_query || '%'
            or ht.city ilike '%' || search_query || '%'
            or at.name ilike '%' || search_query || '%'
            or at.city ilike '%' || search_query || '%'
        )
        and (filter_team_id    is null or g.home_team_id = filter_team_id or g.away_team_id = filter_team_id)
        and (filter_season     is null or g.season = filter_season)
        and (filter_arena      is null or g.arena = filter_arena)
        and (filter_status     is null or g.status = filter_status)
        and (filter_date       is null or g.game_date::date = filter_date)
        and (filter_start_date is null or g.game_date >= filter_start_date)
        and (filter_end_date   is null or g.game_date <= filter_end_date)
    group by g.id, ht.id, at.id
    order by g.game_date desc;
$$;


ALTER FUNCTION "public"."search_games"("search_query" "text", "filter_team_id" "uuid", "filter_season" "text", "filter_arena" "text", "filter_status" "text", "filter_date" "date", "filter_start_date" timestamp without time zone, "filter_end_date" timestamp without time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."toggle_like"("p_review_id" "uuid", "p_user_id" "uuid", "p_action" "text") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  new_count integer;
BEGIN
  IF p_action = 'like' THEN
    INSERT INTO public.review_likes (review_id, user_id, created_at)
    VALUES (p_review_id, p_user_id, now())
    ON CONFLICT DO NOTHING;
  ELSE
    DELETE FROM public.review_likes
    WHERE review_id = p_review_id AND user_id = p_user_id;
  END IF;

  SELECT COUNT(*) INTO new_count
  FROM public.review_likes
  WHERE review_id = p_review_id;

  UPDATE public.reviews
  SET likes_count = new_count
  WHERE id = p_review_id;

  RETURN new_count;
END;
$$;


ALTER FUNCTION "public"."toggle_like"("p_review_id" "uuid", "p_user_id" "uuid", "p_action" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "review_id" "uuid",
    "comment_text" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."follows" (
    "follower_id" "uuid" NOT NULL,
    "following_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."follows" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."games" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "home_team_id" "uuid",
    "away_team_id" "uuid",
    "game_date" timestamp without time zone,
    "season" character varying,
    "home_score" integer,
    "away_score" integer,
    "arena" character varying,
    "status" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "image_url" "text"
);


ALTER TABLE "public"."games" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."list_games" (
    "list_id" "uuid" NOT NULL,
    "game_id" "uuid" NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."list_games" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "title" character varying,
    "description" "text",
    "is_public" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "type" character varying DEFAULT 'list'::character varying NOT NULL,
    CONSTRAINT "lists_type_check" CHECK ((("type")::"text" = ANY ((ARRAY['list'::character varying, 'watchlist'::character varying])::"text"[])))
);


ALTER TABLE "public"."lists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."player_games" (
    "player_id" "uuid" NOT NULL,
    "game_id" "uuid" NOT NULL,
    "team_id" "uuid",
    "pts" integer DEFAULT 0,
    "ast" integer DEFAULT 0,
    "reb" integer DEFAULT 0,
    "min" integer,
    "fga" integer,
    "fgm" integer,
    "three_fga" integer,
    "three_fgm" integer,
    "fta" integer,
    "ftm" integer,
    "fg_pct" real,
    "stl" integer,
    "blk" integer
);


ALTER TABLE "public"."player_games" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."player_ratings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "player_id" "uuid" NOT NULL,
    "game_id" "uuid" NOT NULL,
    "rating" integer,
    "user_id" "uuid" NOT NULL,
    CONSTRAINT "player_ratings_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 10)))
);


ALTER TABLE "public"."player_ratings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."players" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "full_name" character varying,
    "jersey_number" integer,
    "position" character varying,
    "team_id" "uuid",
    "image_url" "text"
);


ALTER TABLE "public"."players" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" character varying,
    "display_name" character varying,
    "bio" "text",
    "avatar_url" "text",
    "created_at" timestamp without time zone
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."review_likes" (
    "user_id" "uuid" NOT NULL,
    "review_id" "uuid" NOT NULL,
    "created_at" timestamp without time zone
);


ALTER TABLE "public"."review_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "game_id" "uuid",
    "rating" numeric(2,1),
    "review_text" "text",
    "likes_count" integer DEFAULT 0,
    "created_at" timestamp without time zone,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying,
    "city" character varying,
    "abbreviation" character varying,
    "logo_url" "text"
);


ALTER TABLE "public"."teams" OWNER TO "postgres";


ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_id", "following_id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."list_games"
    ADD CONSTRAINT "list_games_pkey" PRIMARY KEY ("list_id", "game_id");



ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "lists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."player_games"
    ADD CONSTRAINT "player_games_pkey" PRIMARY KEY ("player_id", "game_id");



ALTER TABLE ONLY "public"."player_ratings"
    ADD CONSTRAINT "player_ratings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."player_ratings"
    ADD CONSTRAINT "player_ratings_unique" UNIQUE ("user_id", "game_id", "player_id");



ALTER TABLE ONLY "public"."player_ratings"
    ADD CONSTRAINT "player_ratings_user_player_game_unique" UNIQUE ("user_id", "player_id", "game_id");



ALTER TABLE ONLY "public"."players"
    ADD CONSTRAINT "players_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."review_likes"
    ADD CONSTRAINT "review_likes_pkey" PRIMARY KEY ("user_id", "review_id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_game_unique" UNIQUE ("user_id", "game_id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."player_ratings"
    ADD CONSTRAINT "unique_user_game_player" UNIQUE ("user_id", "game_id", "player_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."list_games"
    ADD CONSTRAINT "list_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."list_games"
    ADD CONSTRAINT "list_games_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."player_games"
    ADD CONSTRAINT "player_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."player_games"
    ADD CONSTRAINT "player_games_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."player_games"
    ADD CONSTRAINT "player_games_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."player_ratings"
    ADD CONSTRAINT "player_ratings_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."player_ratings"
    ADD CONSTRAINT "player_ratings_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."player_ratings"
    ADD CONSTRAINT "player_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."players"
    ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."review_likes"
    ADD CONSTRAINT "review_likes_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."review_likes"
    ADD CONSTRAINT "review_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



CREATE POLICY "Allow all users to read players" ON "public"."players" FOR SELECT USING (true);



CREATE POLICY "Allow authenticated users to like a review" ON "public"."review_likes" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Allow read for everyone" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Allow read for everyone" ON "public"."reviews" FOR SELECT USING (true);



CREATE POLICY "Anyone can view games in public lists" ON "public"."list_games" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."lists"
  WHERE (("lists"."id" = "list_games"."list_id") AND ("lists"."is_public" = true)))));



CREATE POLICY "Authenticated users can create lists" ON "public"."lists" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Leaderboard is publicly readable" ON "public"."player_ratings" FOR SELECT USING (true);



CREATE POLICY "Public lists are viewable by everyone" ON "public"."lists" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Public read access for player_games" ON "public"."player_games" FOR SELECT USING (true);



CREATE POLICY "Users can add games to their own lists" ON "public"."list_games" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."lists"
  WHERE (("lists"."id" = "list_games"."list_id") AND ("lists"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can create own lists" ON "public"."lists" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete from own lists" ON "public"."list_games" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."lists"
  WHERE (("lists"."id" = "list_games"."list_id") AND ("lists"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can delete own lists" ON "public"."lists" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own ratings" ON "public"."player_ratings" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own reviews" ON "public"."reviews" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert into own lists" ON "public"."list_games" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."lists"
  WHERE (("lists"."id" = "list_games"."list_id") AND ("lists"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert their own reviews" ON "public"."reviews" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can remove games from their own lists" ON "public"."list_games" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."lists"
  WHERE (("lists"."id" = "list_games"."list_id") AND ("lists"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update own lists" ON "public"."lists" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their ratings" ON "public"."player_ratings" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own list games" ON "public"."list_games" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."lists"
  WHERE (("lists"."id" = "list_games"."list_id") AND ("lists"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view own lists" ON "public"."lists" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "allow everyone to view likes" ON "public"."review_likes" FOR SELECT USING (true);



CREATE POLICY "anon select player_ratings" ON "public"."player_ratings" FOR SELECT TO "anon" USING (true);



CREATE POLICY "authenticated users can delete their own like" ON "public"."review_likes" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "authenticated users can increment likes_count safely" ON "public"."reviews" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("likes_count" = "likes_count"));



CREATE POLICY "authenticated users can submit player rating" ON "public"."player_ratings" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."follows" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "follows are publicly readable" ON "public"."follows" FOR SELECT USING (true);



ALTER TABLE "public"."games" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "games are publicly readable" ON "public"."games" FOR SELECT USING (true);



ALTER TABLE "public"."list_games" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."player_games" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."player_ratings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."players" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."review_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "reviews are publicly readable" ON "public"."reviews" FOR SELECT;



ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "teams are publicly readable" ON "public"."teams" FOR SELECT USING (true);



CREATE POLICY "users can follow others" ON "public"."follows" FOR INSERT WITH CHECK (("auth"."uid"() = "follower_id"));



CREATE POLICY "users can unfollow" ON "public"."follows" FOR DELETE USING (("auth"."uid"() = "follower_id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."get_game_leaderboard"("p_game_id" "uuid", "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_game_leaderboard"("p_game_id" "uuid", "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_game_leaderboard"("p_game_id" "uuid", "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."search_games"("search_query" "text", "filter_team_id" "uuid", "filter_season" "text", "filter_arena" "text", "filter_status" "text", "filter_date" "date", "filter_start_date" timestamp without time zone, "filter_end_date" timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."search_games"("search_query" "text", "filter_team_id" "uuid", "filter_season" "text", "filter_arena" "text", "filter_status" "text", "filter_date" "date", "filter_start_date" timestamp without time zone, "filter_end_date" timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_games"("search_query" "text", "filter_team_id" "uuid", "filter_season" "text", "filter_arena" "text", "filter_status" "text", "filter_date" "date", "filter_start_date" timestamp without time zone, "filter_end_date" timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."toggle_like"("p_review_id" "uuid", "p_user_id" "uuid", "p_action" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."toggle_like"("p_review_id" "uuid", "p_user_id" "uuid", "p_action" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."toggle_like"("p_review_id" "uuid", "p_user_id" "uuid", "p_action" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."follows" TO "anon";
GRANT ALL ON TABLE "public"."follows" TO "authenticated";
GRANT ALL ON TABLE "public"."follows" TO "service_role";



GRANT ALL ON TABLE "public"."games" TO "anon";
GRANT ALL ON TABLE "public"."games" TO "authenticated";
GRANT ALL ON TABLE "public"."games" TO "service_role";



GRANT ALL ON TABLE "public"."list_games" TO "anon";
GRANT ALL ON TABLE "public"."list_games" TO "authenticated";
GRANT ALL ON TABLE "public"."list_games" TO "service_role";



GRANT ALL ON TABLE "public"."lists" TO "anon";
GRANT ALL ON TABLE "public"."lists" TO "authenticated";
GRANT ALL ON TABLE "public"."lists" TO "service_role";



GRANT ALL ON TABLE "public"."player_games" TO "anon";
GRANT ALL ON TABLE "public"."player_games" TO "authenticated";
GRANT ALL ON TABLE "public"."player_games" TO "service_role";



GRANT ALL ON TABLE "public"."player_ratings" TO "anon";
GRANT ALL ON TABLE "public"."player_ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."player_ratings" TO "service_role";



GRANT ALL ON TABLE "public"."players" TO "anon";
GRANT ALL ON TABLE "public"."players" TO "authenticated";
GRANT ALL ON TABLE "public"."players" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT SELECT("id") ON TABLE "public"."profiles" TO "anon";
GRANT SELECT("id") ON TABLE "public"."profiles" TO "authenticated";



GRANT SELECT("username") ON TABLE "public"."profiles" TO "anon";
GRANT SELECT("username") ON TABLE "public"."profiles" TO "authenticated";



GRANT SELECT("display_name") ON TABLE "public"."profiles" TO "anon";
GRANT SELECT("display_name") ON TABLE "public"."profiles" TO "authenticated";



GRANT SELECT("avatar_url") ON TABLE "public"."profiles" TO "anon";
GRANT SELECT("avatar_url") ON TABLE "public"."profiles" TO "authenticated";



GRANT ALL ON TABLE "public"."review_likes" TO "anon";
GRANT ALL ON TABLE "public"."review_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."review_likes" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































