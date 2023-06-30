import Link from "next/link";
import styles from "@/styles/tabs.module.css";
import { buildClassNames } from "@/utils/functions";
import { useRouter } from "next/router";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { useEffect } from "react";

interface Props {
  tabItems: TabItem[];
  currentTabItem: string;
  breakpoint: number;
}
interface TabItem {
  href: string;
  link: string;
}

export default function Tabs({ tabItems, currentTabItem, breakpoint }: Props) {
  const router = useRouter();

  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width < breakpoint) {
      const tabItems = window.document.getElementsByClassName(styles.tabItem);

      for (let i = 0; i < tabItems.length; i++) {
        const element = tabItems[i] as HTMLElement;
        element.style.border = "none";
        element.style.borderRadius = "10px";
      }
    } else {
      const tabItems = window.document.getElementsByClassName(styles.tabItem);
      for (let i = 0; i < tabItems.length; i++) {
        const element = tabItems[i] as HTMLElement;
        element.style.border = "1px solid #d0d5dd";
      }

      const tabContainer = window.document.getElementById(
        "tab-container"
      ) as HTMLElement;
      const tabContainerChildren = tabContainer.children;

      if (tabContainerChildren.length > 0) {
        const firstItem = tabContainerChildren[0] as HTMLElement;
        const lastItem = tabContainerChildren[
          tabContainerChildren.length - 1
        ] as HTMLElement;

        lastItem.style.borderTopLeftRadius = "0px";
        lastItem.style.borderBottomLeftRadius = "0px";

        firstItem.style.borderTopRightRadius = "0px";
        firstItem.style.borderBottomRightRadius = "0px";
      }

      for (let i = 1; i < tabContainerChildren.length - 1; i++) {
        const elem = tabContainerChildren[i] as HTMLElement;
        elem.style.borderRadius = "0px";
      }
    }
  }, [width, breakpoint]);

  const getHref = (href: string) => {
    const pathNameParts = window.location.pathname.split("/");

    let ret = "";
    pathNameParts.forEach((item, i) => {
      if (i === 3) {
        ret += href;
      } else {
        ret += "/" + item;
      }
    });

    return ret.replace("//", "/");
  };
  return (
    <div className={styles.tabContainer} id={"tab-container"}>
      {tabItems.map((item) => {
        const isActive = item.href.replace("/", "") === currentTabItem;
        const classNames = buildClassNames(
          isActive
            ? [styles.tabItem, styles.tabActive]
            : [styles.tabItem, styles.tabUnactive]
        );

        return (
          <div
            key={item.href}
            className={classNames}
            onClick={() => {
              router.push(getHref(item.href));
            }}
          >
            <Link href={getHref(item.href)}>{item.link}</Link>
          </div>
        );
      })}
    </div>
  );
}
