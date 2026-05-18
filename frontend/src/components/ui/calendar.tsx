import * as React from "react";
import {
  Day as RdpDay,
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
  Weekday as RdpWeekday,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
} from "lucide-react";

const CalendarGetDayAmountContext = React.createContext<
  ((date: Date) => React.ReactNode) | undefined
>(undefined);

const CalendarMonthSummaryContext = React.createContext<
  { incomeTotal: number; expenseTotal: number } | undefined
>(undefined);

function format_weekend_header_bg(children: React.ReactNode) {
  const ch = String(children);
  if (ch === "日" || ch === "Su" || ch === "Sun" || ch.startsWith("日")) {
    return "bg-rose-100/50 dark:bg-rose-950/25";
  }
  if (
    ch === "土" ||
    ch === "Sa" ||
    ch === "Sat" ||
    (ch.length > 0 && ch.startsWith("土"))
  ) {
    return "bg-sky-100/50 dark:bg-sky-950/25";
  }
  return null;
}

function CalendarWeekday(props: React.ComponentProps<typeof RdpWeekday>) {
  const { className, children, ...rest } = props;
  const weekend_bg = format_weekend_header_bg(children);
  return (
    <th className={cn(className, weekend_bg)} {...rest}>
      {children}
    </th>
  );
}

function CalendarDay(props: React.ComponentProps<typeof RdpDay>) {
  // rdp: day/modifiers は td に渡さない
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- DOM に展開してはいけない
  const { day, className, modifiers, ...rest } = props;
  const dow = day.date.getDay();
  return (
    <td
      className={cn(
        className,
        dow === 0 && "bg-rose-100/50 dark:bg-rose-950/25",
        dow === 6 && "bg-sky-100/50 dark:bg-sky-950/25",
      )}
      {...rest}
    />
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  getDayAmount,
  monthSummary,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  getDayAmount?: (date: Date) => React.ReactNode;
  monthSummary?: { incomeTotal: number; expenseTotal: number };
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <CalendarGetDayAmountContext.Provider value={getDayAmount}>
    <CalendarMonthSummaryContext.Provider value={monthSummary}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(
          "group/calendar bg-background p-1 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
          String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
          String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
          className,
        )}
        captionLayout={captionLayout}
        locale={locale}
        formatters={{
          formatMonthDropdown: (date) =>
            date.toLocaleString(locale?.code, { month: "short" }),
          ...formatters,
        }}
        classNames={{
          root: cn("w-full min-w-0", defaultClassNames.root),
          months: cn(
            "relative flex flex-col gap-2 md:flex-row",
            defaultClassNames.months,
          ),
          month: cn("flex w-full flex-col gap-2", defaultClassNames.month),
          nav: cn(
            "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
            defaultClassNames.nav,
          ),
          button_previous: cn(
            buttonVariants({ variant: buttonVariant }),
            "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
            defaultClassNames.button_previous,
          ),
          button_next: cn(
            buttonVariants({ variant: buttonVariant }),
            "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
            defaultClassNames.button_next,
          ),
          month_caption: cn(
            "flex h-(--cell-size) w-full items-center justify-center px-2",
            defaultClassNames.month_caption,
          ),
          dropdowns: cn(
            "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
            defaultClassNames.dropdowns,
          ),
          dropdown_root: cn(
            "relative rounded-(--cell-radius)",
            defaultClassNames.dropdown_root,
          ),
          dropdown: cn(
            "absolute inset-0 bg-popover opacity-0",
            defaultClassNames.dropdown,
          ),
          caption_label: cn(
            "font-medium select-none",
            captionLayout === "label"
              ? "text-sm"
              : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
            defaultClassNames.caption_label,
          ),
          table: "w-full border-collapse",
          weekdays: cn("flex", defaultClassNames.weekdays),
          weekday: cn(
            "flex-1 border border-border/40 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
            defaultClassNames.weekday,
          ),
          week: cn("mt-1 flex w-full", defaultClassNames.week),
          week_number_header: cn(
            "w-(--cell-size) border border-border/40 select-none",
            defaultClassNames.week_number_header,
          ),
          week_number: cn(
            "border border-border/40 text-[0.8rem] text-muted-foreground select-none",
            defaultClassNames.week_number,
          ),
          day: cn(
            "group/day relative min-w-0 flex-1 aspect-[3/3] rounded-(--cell-radius) border border-border/40 p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
            props.showWeekNumber
              ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
              : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
            defaultClassNames.day,
          ),
          range_start: cn(
            "relative isolate z-0 rounded-l-(--cell-radius)",
            defaultClassNames.range_start,
          ),
          range_middle: cn("rounded-none", defaultClassNames.range_middle),
          range_end: cn(
            "relative isolate z-0 rounded-r-(--cell-radius)",
            defaultClassNames.range_end,
          ),
          today: cn(
            "rounded-(--cell-radius) bg-pink-100/70 text-foreground data-[selected=true]:rounded-none dark:bg-pink-950/30",
            defaultClassNames.today,
          ),
          outside: cn(
            "text-muted-foreground aria-selected:text-muted-foreground",
            defaultClassNames.outside,
          ),
          disabled: cn(
            "text-muted-foreground opacity-50",
            defaultClassNames.disabled,
          ),
          hidden: cn("invisible", defaultClassNames.hidden),
          ...classNames,
        }}
        components={{
          Day: CalendarDay,
          Weekday: CalendarWeekday,
          Root: ({ className, rootRef, ...props }) => {
            return (
              <div
                data-slot="calendar"
                ref={rootRef}
                className={cn(className)}
                {...props}
              />
            );
          },
          Chevron: ({ className, orientation, ...props }) => {
            if (orientation === "left") {
              return (
                <ChevronLeftIcon
                  className={cn("size-4", className)}
                  {...props}
                />
              );
            }

            if (orientation === "right") {
              return (
                <ChevronRightIcon
                  className={cn("size-4", className)}
                  {...props}
                />
              );
            }

            return (
              <ChevronDownIcon className={cn("size-4", className)} {...props} />
            );
          },
          Month: ({ children, className: monthClassName, ...monthProps }) => {
            const summary = React.useContext(CalendarMonthSummaryContext);
            const childArr = React.Children.toArray(children);
            return (
              <div className={monthClassName} {...monthProps}>
                {childArr[0]}
                {summary != null && (() => {
                  const balance = summary.incomeTotal - summary.expenseTotal;
                  const is_positive = balance >= 0;
                  return (
                    <div className="mx-1 mb-1 overflow-hidden rounded-lg border">
                      <div className="flex items-center justify-between bg-muted/40 px-4 py-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <WalletIcon size={13} />
                          <span>今月の収支</span>
                        </div>
                        <span className={cn(
                          'text-base font-bold tabular-nums',
                          is_positive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400',
                        )}>
                          {is_positive ? '+' : ''}{balance.toLocaleString()} 円
                        </span>
                      </div>
                      <div className="grid grid-cols-2 divide-x border-t text-sm">
                        <div className="flex flex-col gap-0.5 px-4 py-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingUpIcon size={11} />
                            <span>収入</span>
                          </div>
                          <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                            +{summary.incomeTotal.toLocaleString()} 円
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 px-4 py-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingDownIcon size={11} />
                            <span>支出</span>
                          </div>
                          <span className="font-bold tabular-nums text-red-600 dark:text-red-400">
                            -{summary.expenseTotal.toLocaleString()} 円
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                {childArr.slice(1)}
              </div>
            );
          },
          DayButton: ({ ...props }) => (
            <CalendarDayButton locale={locale} {...props} />
          ),
          WeekNumber: ({ children, ...props }) => {
            return (
              <td {...props}>
                <div className="flex size-(--cell-size) items-center justify-center text-center">
                  {children}
                </div>
              </td>
            );
          },
          ...components,
        }}
        {...props}
      />
    </CalendarMonthSummaryContext.Provider>
    </CalendarGetDayAmountContext.Provider>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  children,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();
  const getDayAmount = React.useContext(CalendarGetDayAmountContext);
  const day_amount = getDayAmount?.(day.date);

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const is_selected_single =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle;

  const dow = day.date.getDay();

  return (
    <Button
      ref={ref}
      variant="ghost"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={is_selected_single}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex h-full! w-full! min-h-0 min-w-0 flex-col items-stretch justify-start gap-0 overflow-hidden border-0 p-1 text-left text-sm leading-none font-medium sm:text-base",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-foreground data-[range-middle=true]:hover:bg-transparent!",
        "data-[selected-single=true]:bg-transparent data-[selected-single=true]:text-foreground data-[selected-single=true]:ring-2 data-[selected-single=true]:ring-inset data-[selected-single=true]:ring-primary/60 dark:data-[selected-single=true]:ring-primary/50",
        "data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-transparent data-[range-start=true]:text-foreground data-[range-start=true]:ring-2 data-[range-start=true]:ring-inset data-[range-start=true]:ring-primary/60 dark:data-[range-start=true]:ring-primary/50",
        "data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-transparent data-[range-end=true]:text-foreground data-[range-end=true]:ring-2 data-[range-end=true]:ring-inset data-[range-end=true]:ring-primary/60 dark:data-[range-end=true]:ring-primary/50",
        "data-[selected-single=true]:hover:bg-transparent! data-[range-start=true]:hover:bg-transparent! data-[range-end=true]:hover:bg-transparent!",
        dow === 0 &&
          "not-data-[selected-single=true]:not-data-[range-start=true]:not-data-[range-end=true]:hover:bg-rose-200/45!",
        dow === 6 &&
          "not-data-[selected-single=true]:not-data-[range-start=true]:not-data-[range-end=true]:hover:bg-sky-200/45!",
        defaultClassNames.day,
        className,
      )}
      {...props}
    >
      <span
        className="pointer-events-none shrink-0 self-end tabular-nums"
        data-slot="calendar-day-number"
      >
        {children}
      </span>
      {/** 家計: getDayAmount（収入・支出など） */}
      <div
        className={cn(
          "flex min-h-0 flex-1 items-center justify-center px-0.5 text-center text-[0.8rem] leading-tight",
          day_amount != null && day_amount !== false ? "" : "opacity-40",
        )}
        data-slot="calendar-day-amount"
        aria-hidden
      >
        {day_amount ?? null}
      </div>
    </Button>
  );
}

export { Calendar, CalendarDayButton };
