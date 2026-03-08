from __future__ import annotations

from pathlib import Path
import xml.etree.ElementTree as ET


SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
EXCLUDED_URLS: set[str] = set()


def on_config(config):
    EXCLUDED_URLS.clear()
    return config


def _canonical_url(page, config) -> str:
    site_url = str(config.get("site_url", "")).rstrip("/")
    page_url = getattr(page, "url", "") or ""
    return f"{site_url}/{page_url}".rstrip("/") + "/"


def on_page_context(context, page, config, nav):
    meta = getattr(page, "meta", {}) or {}
    robots = str(meta.get("robots", "")).lower()
    exclude_from_sitemap = meta.get("sitemap") is False or "noindex" in robots

    if exclude_from_sitemap:
        EXCLUDED_URLS.add(_canonical_url(page, config))

    return context


def on_post_build(config):
    sitemap_path = Path(config["site_dir"]) / "sitemap.xml"
    if not sitemap_path.exists() or not EXCLUDED_URLS:
        return

    tree = ET.parse(sitemap_path)
    root = tree.getroot()

    for url_node in root.findall("sm:url", SITEMAP_NS):
        loc_node = url_node.find("sm:loc", SITEMAP_NS)
        if loc_node is None:
            continue
        loc = (loc_node.text or "").rstrip("/") + "/"
        if loc in EXCLUDED_URLS:
            root.remove(url_node)

    tree.write(sitemap_path, encoding="utf-8", xml_declaration=True)
