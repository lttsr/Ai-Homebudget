package api.util.document;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * CSV の生成・ファイル入出力を行うユーティリティ。
 */
public final class CsvUtil {

    private static final byte[] UTF8_BOM = new byte[] { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF };

    private CsvUtil() {
    }

    /**
     * ヘッダーと行データから CSV 文字列を生成します。
     *
     * @param headers ヘッダー行
     * @param rows    データ行
     * @return CSV 文字列
     */
    public static String toCsv(List<String> headers, List<List<String>> rows) {
        var sb = new StringBuilder();
        sb.append(toLine(headers)).append('\n');

        for (List<String> row : rows) {
            sb.append(toLine(row)).append('\n');
        }

        return sb.toString();
    }

    /**
     * 任意の型リストを CSV 文字列に変換します。
     *
     * @param headers   ヘッダー行
     * @param items     変換対象リスト
     * @param rowMapper 1件を CSV 行（セル値リスト）に変換する関数
     * @return CSV 文字列
     */
    public static <T> String toCsv(List<String> headers, List<T> items, Function<T, List<String>> rowMapper) {
        List<List<String>> rows = items.stream()
                .map(rowMapper)
                .toList();
        return toCsv(headers, rows);
    }

    /**
     * CSV セル値に変換します。null は空文字になります。
     *
     * @param value セル値
     * @return 文字列
     */
    public static String cell(Object value) {
        return value == null ? "" : value.toString();
    }

    /**
     * CSV の1セルをエスケープします。
     *
     * @param value セル値
     * @return エスケープ後の値
     */
    public static String escape(String value) {
        if (value == null) {
            return "";
        }
        if (value.contains(",") || value.contains("\"") || value.contains("\n") || value.contains("\r")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    /**
     * CSV 文字列をファイルに書き込みます。
     *
     * @param path 出力先
     * @param csv  CSV 文字列
     */
    public static void write(Path path, String csv) throws IOException {
        Path parent = path.getParent();
        if (parent != null) {
            Files.createDirectories(parent);
        }
        Files.writeString(path, csv, StandardCharsets.UTF_8);
    }

    /**
     * UTF-8 BOM 付きで CSV 文字列をファイルに書き込みます。
     * Excel で開く場合に使用します。
     *
     * @param path 出力先
     * @param csv  CSV 文字列
     */
    public static void writeWithBom(Path path, String csv) throws IOException {
        Path parent = path.getParent();
        if (parent != null) {
            Files.createDirectories(parent);
        }
        byte[] body = csv.getBytes(StandardCharsets.UTF_8);
        byte[] content = new byte[UTF8_BOM.length + body.length];
        System.arraycopy(UTF8_BOM, 0, content, 0, UTF8_BOM.length);
        System.arraycopy(body, 0, content, UTF8_BOM.length, body.length);
        Files.write(path, content);
    }

    /**
     * CSV ファイルを文字列として読み込みます。
     *
     * @param path 読み込み元
     * @return CSV 文字列
     */
    public static String read(Path path) throws IOException {
        return Files.readString(path, StandardCharsets.UTF_8);
    }

    private static String toLine(List<String> cells) {
        return cells.stream()
                .map(CsvUtil::escape)
                .collect(Collectors.joining(","));
    }
}
